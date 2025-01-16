import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { schemaNamesPrompt } from "../../../constants/prompt/schemNames";
import { schemaPropsPrompt } from "../../../constants/prompt/schemaProps";
import { schemaLayoutPrompt } from "@/constants/prompt/schemaLayouts";
import { llmJsonParse } from "@/utils";
import type { IBaseSchema, ISchemaProps, ISchemaLayout, IFinalSchema } from "@/types";
import { NextRequest } from "next/server";

const baseSchemaAgent = async (messages: BaseMessage[], writer: WritableStreamDefaultWriter<Uint8Array>) => {
  writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ doneSteps: [], runningStep: 'schemaNames' }) })}\n\n`));

  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-2024-11-20",
  });

  const stream = model.stream([
    new SystemMessage(schemaNamesPrompt),
    ...messages,
  ]);

  let aiMessage = '';
  for await (const chunk of await stream) {
    aiMessage += chunk.content;
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'schemNames', data: chunk.content })}\n\n`));
  }

  return aiMessage;
}

const schemaPropsAgent = async (messages: BaseMessage[], writer: WritableStreamDefaultWriter<Uint8Array>, schemNames: string) => {
  writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ doneSteps: ['schemaNames'], runningStep: 'schemaProps' }) })}\n\n`));

  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-2024-11-20",
  });

  const stream = model.stream([
    new SystemMessage(schemaPropsPrompt),
    ...messages,
    new AIMessage(schemNames),
  ]);

  let aiMessage = '';
  for await (const chunk of await stream) {
    aiMessage += chunk.content;
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'schemaProps', data: chunk.content })}\n\n`));
  }

  return aiMessage;
}

const schemaLayoutAgent = async (messages: BaseMessage[], writer: WritableStreamDefaultWriter<Uint8Array>, schemaProps: string) => {
  writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ doneSteps: ['schemaNames', 'schemaProps'], runningStep: 'schemaLayouts' }) })}\n\n`));

  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-2024-11-20",
  });

  const stream = model.stream([
    new SystemMessage(schemaLayoutPrompt),
    ...messages,
    new AIMessage(schemaProps),
  ]);

  let aiMessage = '';
  for await (const chunk of await stream) {
    aiMessage += chunk.content;
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'schemaLayouts', data: chunk.content })}\n\n`));
  }

  return aiMessage;
}

const schemaAgent = async (messages: BaseMessage[], writer: WritableStreamDefaultWriter<Uint8Array>) => {
  const schemNames = await baseSchemaAgent(messages, writer);
  const baseSchemaJSON = llmJsonParse(schemNames) as IBaseSchema;

  let finalSchemaJSON: IFinalSchema = {};

  for (const key in baseSchemaJSON) {
    finalSchemaJSON[key] = {
      type: baseSchemaJSON[key].type,
      parent: baseSchemaJSON[key].parent,
    };
  }

  const schemaProps = await schemaPropsAgent(messages, writer, JSON.stringify(finalSchemaJSON));
  const schemaPropsJSON = llmJsonParse(schemaProps) as ISchemaProps;

  for (const key in schemaPropsJSON) {
    if (finalSchemaJSON[key]) {
      finalSchemaJSON[key].props = schemaPropsJSON[key]?.props || {};
    }
  }

  const schemaLayouts = await schemaLayoutAgent(messages, writer, JSON.stringify(finalSchemaJSON));
  const schemaLayoutJSON = llmJsonParse(schemaLayouts) as ISchemaLayout;
  for (const key in schemaLayoutJSON) {
    if (finalSchemaJSON[key]) {
      finalSchemaJSON[key].layout = schemaLayoutJSON[key]?.layout || { rowStart: 0, rowEnd: 0, colStart: 0, colEnd: 0 };
      finalSchemaJSON[key].style = schemaLayoutJSON[key]?.style || {};
    }
  }
  writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'finalSchema', data: `\`\`\`json\n${JSON.stringify(finalSchemaJSON, null, 2)}\n\`\`\`` })}\n\n`));

  writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ doneSteps: ['schemaNames', 'schemaProps', 'schemaLayouts'], runningStep: '' }) })}\n\n`));
}

export async function POST(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  const { messages } = await req.json();

  schemaAgent(messages, writer);

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Transfer-Encoding': 'chunked',
    },
  });
} 