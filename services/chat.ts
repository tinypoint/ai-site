import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { schemaNamesPrompt } from "@/constants/prompt/schemaNames";
import { schemaPropsPrompt } from "@/constants/prompt/schemaProps";
import { schemaLayoutPrompt } from "@/constants/prompt/schemaLayouts";
import { llmJsonParse } from "@/utils";
import type { IBaseSchema, ISchemaProps, ISchemaLayout, IFinalSchema } from "@/types";
import { planPrompt } from "@/constants/prompt/plan";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";


const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    value: () => [] as BaseMessage[],
  }),
  sitePlan: Annotation<string>({
    value: () => '',
  }),
  schemaNames: Annotation<string>({
    value: () => '',
  }),
  schemaNamesJSON: Annotation<IBaseSchema>({
    value: () => ({} as IBaseSchema),
  }),
  schemaLayouts: Annotation<string>({
    value: () => '',
  }),
  schemaLayoutsJSON: Annotation<ISchemaLayout>({
    value: () => ({} as ISchemaLayout),
  }),
  schemaProps: Annotation<string>({
    value: () => '',
  }),
  schemaPropsJSON: Annotation<ISchemaProps>({
    value: () => ({} as ISchemaProps),
  }),
  finalSchema: Annotation<IFinalSchema>({
    value: () => ({} as IFinalSchema),
  }),
});
export const schemaAgent = async (messages: BaseMessage[], writer: WritableStreamDefaultWriter<Uint8Array>) => {
  const planSiteProduction = async (state: typeof StateAnnotation.State) => {
    const { messages } = state;
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ doneSteps: [], runningStep: 'planSiteProduction' }) })}\n\n`));

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-2024-11-20",
      temperature: 1,
    });

    const stream = model.stream([
      new SystemMessage(planPrompt),
      ...messages,
    ]);

    let sitePlan = '';
    for await (const chunk of await stream) {
      sitePlan += chunk.content;
      writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'plan', data: chunk.content })}\n\n`));
    }

    return {
      sitePlan
    };
  }

  const baseSchemaAgent = async (state: typeof StateAnnotation.State) => {
    const { messages, sitePlan } = state;
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ doneSteps: [], runningStep: 'schemaNames' }) })}\n\n`));

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-2024-11-20",
      temperature: 1,
    });

    const stream = model.stream([
      new SystemMessage(schemaNamesPrompt),
      ...messages,
      new AIMessage(sitePlan),
    ]);

    let schemaNames = '';
    for await (const chunk of await stream) {
      schemaNames += chunk.content;
      writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'schemaNames', data: chunk.content })}\n\n`));
    }

    const schemaNamesJSON = llmJsonParse(schemaNames);
    const finalSchemaJSON: IFinalSchema = {};
    for (const key in schemaNamesJSON) {
      finalSchemaJSON[key] = {
        type: schemaNamesJSON[key].type,
        parent: schemaNamesJSON[key].parent,
      };
    }

    return {
      schemaNames,
      schemaNamesJSON,
      finalSchemaJSON
    };
  }

  const schemaLayoutAgent = async (state: typeof StateAnnotation.State) => {
    const { messages, sitePlan, schemaNames, schemaNamesJSON } = state;
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ doneSteps: ['schemaNames',], runningStep: 'schemaLayouts' }) })}\n\n`));

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-2024-11-20",
      temperature: 1,
    });

    const stream = model.stream([
      new SystemMessage(schemaLayoutPrompt),
      ...messages,
      new AIMessage(sitePlan),
      new HumanMessage(`请你为这个 schema\n${schemaNames}\n 生成布局，要保证schema的结构不变,不要增加或删除组件`)
    ]);

    let schemaLayouts = '';
    for await (const chunk of await stream) {
      schemaLayouts += chunk.content;
      writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'schemaLayouts', data: chunk.content })}\n\n`));
    }

    const schemaLayoutsJSON = llmJsonParse(schemaLayouts);
    const finalSchemaJSON: IFinalSchema = {};
    for (const key in schemaNamesJSON) {
      finalSchemaJSON[key] = {
        type: schemaNamesJSON[key].type,
        parent: schemaNamesJSON[key].parent,
        layout: schemaLayoutsJSON[key]?.layout || { rowStart: 0, rowSpan: 0, colStart: 0, colSpan: 0 },
        style: schemaLayoutsJSON[key]?.style || {},
      };
    }

    return {
      schemaLayouts,
      schemaLayoutsJSON,
      finalSchemaJSON
    };
  }

  const schemaPropsAgent = async (state: typeof StateAnnotation.State) => {
    const { messages, sitePlan, schemaNamesJSON, schemaLayouts, schemaLayoutsJSON } = state;
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ doneSteps: ['schemaNames', 'schemaLayouts'], runningStep: 'schemaProps' }) })}\n\n`));

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-2024-11-20",
      temperature: 1,
    });
    const stream = model.stream([
      new SystemMessage(schemaPropsPrompt),
      ...messages,
      new AIMessage(sitePlan),
      new HumanMessage(`请你为这个 schema\n${schemaLayouts}\n 生成属性，要保证schema的结构不变,不要增加或删除组件`)
    ]);

    let schemaProps = '';
    for await (const chunk of await stream) {
      schemaProps += chunk.content;
      writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'schemaProps', data: chunk.content })}\n\n`));
    }

    const schemaPropsJSON = llmJsonParse(schemaProps);
    const finalSchemaJSON: IFinalSchema = {};
    for (const key in schemaNamesJSON) {
      finalSchemaJSON[key] = {
        type: schemaNamesJSON[key].type,
        parent: schemaNamesJSON[key].parent,
        layout: schemaLayoutsJSON[key]?.layout,
        style: schemaLayoutsJSON[key]?.style,
        props: schemaPropsJSON[key]?.props,
      };
    }

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'finalSchema', data: `\`\`\`json\n${JSON.stringify(finalSchemaJSON, null, 2)}\n\`\`\`` })}\n\n`));

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ doneSteps: ['schemaNames', 'schemaProps', 'schemaLayouts', 'finalSchema'], runningStep: '' }) })}\n\n`));

    return {
      schemaProps,
      schemaPropsJSON,
      finalSchemaJSON
    };
  }
  const workflow = new StateGraph(StateAnnotation)
    .addNode("plan", planSiteProduction)
    .addNode("names", baseSchemaAgent)
    .addNode("layout", schemaLayoutAgent)
    .addNode("props", schemaPropsAgent)
    .addEdge(START, "plan")
    .addEdge("plan", "names")
    .addEdge("names", "layout")
    .addEdge("layout", "props")
    .addEdge("props", END);

  const app = workflow.compile({});

  const stream = await app.stream(
    { messages: [...messages] },
    { configurable: { thread_id: "42" } }
  );

  for await (const chunk of stream) {
    console.log(chunk);
  }

  writer.close();

  return;

}

// const workflow = new StateGraph(StateAnnotation)
//   .addNode("agent", callModel)
//   .addNode("tools", toolNode)
//   .addEdge("__start__", "agent")
//   .addConditionalEdges("agent", shouldContinue)
//   .addEdge("tools", "agent");