import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { schemaNamesPrompt } from "../../../constants/prompt/schemaNames";
import { schemaPropsPrompt } from "../../../constants/prompt/schemaProps";
import { schemaLayoutPrompt } from "@/constants/prompt/schemaLayouts";
import { llmJsonParse } from "@/utils";
import type { IBaseSchema, ISchemaProps, ISchemaLayout, IFinalSchema } from "@/types";
import { NextRequest } from "next/server";
import { planPrompt } from "@/constants/prompt/plan";
import { Message } from "@/store/chatStore";

const planSiteProduction = async (messages: BaseMessage[], writer: WritableStreamDefaultWriter<Uint8Array>) => {
  writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ doneSteps: [], runningStep: 'planSiteProduction' }) })}\n\n`));

  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-2024-11-20",
  });

  const stream = model.stream([
    new SystemMessage(planPrompt),
    ...messages,
  ]);

  let aiMessage = '';
  for await (const chunk of await stream) {
    aiMessage += chunk.content;
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'plan', data: chunk.content })}\n\n`));
  }

  return aiMessage;
}

const baseSchemaAgent = async (messages: BaseMessage[], writer: WritableStreamDefaultWriter<Uint8Array>, sitePlan: string) => {
  writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ doneSteps: [], runningStep: 'schemaNames' }) })}\n\n`));

  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-2024-11-20",
  });

  const stream = model.stream([
    new SystemMessage(schemaNamesPrompt),
    ...messages,
    new AIMessage(sitePlan),
  ]);

  let aiMessage = '';
  for await (const chunk of await stream) {
    aiMessage += chunk.content;
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'schemaNames', data: chunk.content })}\n\n`));
  }
  return aiMessage;
}

const schemaPropsAgent = async (messages: BaseMessage[], writer: WritableStreamDefaultWriter<Uint8Array>, sitePlan: string, schemaNames: string) => {
  writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ doneSteps: ['schemaNames'], runningStep: 'schemaProps' }) })}\n\n`));

  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-2024-11-20",
  });
  const stream = model.stream([
    new SystemMessage(schemaPropsPrompt),
    ...messages,
    new AIMessage(sitePlan),
    new AIMessage(schemaNames),
    new HumanMessage('根据我的要求，和你的规划，以及这个 schema，帮我生属性，不要增加或删除组件')
  ]);

  let aiMessage = '';
  for await (const chunk of await stream) {
    aiMessage += chunk.content;
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'schemaProps', data: chunk.content })}\n\n`));
  }

  return aiMessage;
}

const schemaLayoutAgent = async (messages: BaseMessage[], writer: WritableStreamDefaultWriter<Uint8Array>, sitePlan: string, schemaProps: string) => {
  writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ doneSteps: ['schemaNames', 'schemaProps'], runningStep: 'schemaLayouts' }) })}\n\n`));

  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-2024-11-20",
  });

  const stream = model.stream([
    new SystemMessage(schemaLayoutPrompt),
    ...messages,
    new AIMessage(sitePlan),
    new AIMessage(schemaProps),
    new HumanMessage('根据我的要求，和你的规划，以及这个 schema，帮我生成布局，不要增加或删除组件')
  ]);

  let aiMessage = '';
  for await (const chunk of await stream) {
    aiMessage += chunk.content;
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'schemaLayouts', data: chunk.content })}\n\n`));
  }
  return aiMessage;
}

const schemaAgent = async (messages: BaseMessage[], writer: WritableStreamDefaultWriter<Uint8Array>) => {

  const sitePlan = await planSiteProduction(messages, writer);

  const schemaNames = await baseSchemaAgent(messages, writer, sitePlan);
  const baseSchemaJSON = llmJsonParse(schemaNames) as IBaseSchema;

  let finalSchemaJSON: IFinalSchema = {};

  for (const key in baseSchemaJSON) {
    finalSchemaJSON[key] = {
      type: baseSchemaJSON[key].type,
      parent: baseSchemaJSON[key].parent,
    };
  }

  console.log('after names', JSON.stringify(finalSchemaJSON));

  const schemaProps = await schemaPropsAgent(messages, writer, sitePlan, JSON.stringify(finalSchemaJSON));
  const schemaPropsJSON = llmJsonParse(schemaProps) as ISchemaProps;

  for (const key in schemaPropsJSON) {
    if (finalSchemaJSON[key]) {
      finalSchemaJSON[key].props = schemaPropsJSON[key]?.props || {};
    }
  }

  console.log('after props', JSON.stringify(finalSchemaJSON));

  const schemaLayouts = await schemaLayoutAgent(messages, writer, sitePlan, JSON.stringify(finalSchemaJSON));
  const schemaLayoutJSON = llmJsonParse(schemaLayouts) as ISchemaLayout;
  for (const key in schemaLayoutJSON) {
    if (finalSchemaJSON[key]) {
      finalSchemaJSON[key].layout = schemaLayoutJSON[key]?.layout || { rowStart: 0, rowEnd: 0, colStart: 0, colEnd: 0 };
      finalSchemaJSON[key].style = schemaLayoutJSON[key]?.style || {};
    }
  }
  console.log('after layout', JSON.stringify(finalSchemaJSON));

  writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'finalSchema', data: `\`\`\`json\n${JSON.stringify(finalSchemaJSON, null, 2)}\n\`\`\`` })}\n\n`));

  writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ doneSteps: ['schemaNames', 'schemaProps', 'schemaLayouts', 'finalSchema'], runningStep: '' }) })}\n\n`));

  writer.close();
}

export async function POST(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  const { messages } = await req.json();

  const langchainMessages = (messages as Message[]).map(msg => {
    if (msg.role === 'user') {
      return new HumanMessage(msg.content)
    } else if (msg.role === 'ai') {
      return new AIMessage(msg.content);
    }

    return new SystemMessage(msg.content)
  })

  schemaAgent(langchainMessages, writer);

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Transfer-Encoding': 'chunked',
    },
  });
} 