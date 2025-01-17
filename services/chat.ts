import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { schemaTypesPrompt } from "@/constants/prompt/schemaTypes";
import { schemaPropsPrompt } from "@/constants/prompt/schemaProps";
import { schemaLayoutPrompt } from "@/constants/prompt/schemaLayouts";
import { llmJsonParse } from "@/utils";
import type { IBaseSchema, ISchemaProps, ISchemaLayout, IFinalSchema, ISchemaEvents, ISchemaExpressions, IQuerys } from "@/types";
import { planPrompt } from "@/constants/prompt/plan";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { queryPrompt } from "@/constants/prompt/query";
import { schemaEventsPrompt } from "@/constants/prompt/schemaEvents";
import { schemaExpressionsPrompt } from "@/constants/prompt/schemaExpressions";


const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    value: () => [] as BaseMessage[],
    reducer: (_left: BaseMessage[], right: BaseMessage[]) => {
      return [...right]
    }
  }),
  sitePlan: Annotation<string>({
    value: () => '',
  }),
  schemaTypes: Annotation<string>({
    value: () => '',
  }),
  schemaTypesJSON: Annotation<IBaseSchema>({
    value: () => ({} as IBaseSchema),
  }),
  querys: Annotation<string>({
    value: () => '',
  }),
  querysJSON: Annotation<IQuerys>({
    value: () => ({} as IQuerys),
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
  schemaEvents: Annotation<string>({
    value: () => '',
  }),
  schemaEventsJSON: Annotation<ISchemaEvents>({
    value: () => ({} as ISchemaEvents),
  }),
  schemaExpressions: Annotation<string>({
    value: () => '',
  }),
  schemaExpressionsJSON: Annotation<ISchemaExpressions>({
    value: () => ({} as ISchemaExpressions),
  }),
  finalSchema: Annotation<string>({
    value: () => '',
  }),
  finalSchemaJSON: Annotation<IFinalSchema>({
    value: () => ({} as IFinalSchema),
  }),
});
export const schemaAgent = async (messages: BaseMessage[], writer: WritableStreamDefaultWriter<Uint8Array>) => {
  const sitePlanAgent = async (state: typeof StateAnnotation.State) => {
    const { messages } = state;

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
      sitePlan,
      messages: [...messages, new AIMessage(sitePlan)]
    };
  }

  const schemaTypesAgent = async (state: typeof StateAnnotation.State) => {
    const { messages } = state;

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-2024-11-20",
      temperature: 1,
    });

    const stream = model.stream([
      new SystemMessage(schemaTypesPrompt),
      ...messages,
    ]);
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ runningStep: 'schemaTypes' }) })}\n\n`));
    let schemaTypes = '';
    for await (const chunk of await stream) {
      schemaTypes += chunk.content;
      writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'schemaTypes', data: chunk.content })}\n\n`));
    }
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ compeleteStep: 'schemaTypes' }) })}\n\n`));

    const schemaTypesJSON = llmJsonParse(schemaTypes);
    const finalSchemaJSON: IFinalSchema = {};
    for (const key in schemaTypesJSON) {
      finalSchemaJSON[key] = {
        type: schemaTypesJSON[key].type,
        parent: schemaTypesJSON[key].parent,
      };
    }

    return {
      schemaTypes,
      schemaTypesJSON,
      finalSchemaJSON,
      messages: [...messages, new AIMessage(schemaTypes)]
    };
  }

  const querysAgent = async (state: typeof StateAnnotation.State) => {
    const { messages } = state;
    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-2024-11-20",
      temperature: 1,
    });

    const stream = model.stream([
      new SystemMessage(queryPrompt),
      ...messages,
      new HumanMessage('请按照规划，生成页面请求')
    ]);

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ runningStep: 'querys' }) })}\n\n`));
    let querys = '';
    for await (const chunk of await stream) {
      querys += chunk.content;
      writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'querys', data: chunk.content })}\n\n`));
    }
    const querysJSON = llmJsonParse(querys);
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ compeleteStep: 'querys' }) })}\n\n`));

    return {
      querys,
      querysJSON,
      messages: [...messages, new AIMessage(querys)]
    };
  }

  const schemaLayoutsAgent = async (state: typeof StateAnnotation.State) => {
    const { messages } = state;

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-2024-11-20",
      temperature: 1,
    });

    const stream = model.stream([
      new SystemMessage(schemaLayoutPrompt),
      ...messages,
    ]);
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ runningStep: 'schemaLayouts' }) })}\n\n`));
    let schemaLayouts = '';
    for await (const chunk of await stream) {
      schemaLayouts += chunk.content;
      writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'schemaLayouts', data: chunk.content })}\n\n`));
    }
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ compeleteStep: 'schemaLayouts' }) })}\n\n`));
    const schemaLayoutsJSON = llmJsonParse(schemaLayouts);

    return {
      schemaLayouts,
      schemaLayoutsJSON,
      messages: [...messages, new AIMessage(schemaLayouts)]
    };
  }

  const schemaPropsAgent = async (state: typeof StateAnnotation.State) => {
    const { messages } = state;

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-2024-11-20",
      temperature: 1,
    });
    const stream = model.stream([
      new SystemMessage(schemaPropsPrompt),
      ...messages,
    ]);

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ runningStep: 'schemaProps' }) })}\n\n`));
    let schemaProps = '';
    for await (const chunk of await stream) {
      schemaProps += chunk.content;
      writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'schemaProps', data: chunk.content })}\n\n`));
    }

    const schemaPropsJSON = llmJsonParse(schemaProps);

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ compeleteStep: 'schemaProps' }) })}\n\n`));

    return {
      schemaProps,
      schemaPropsJSON,
      messages: [...messages, new AIMessage(schemaProps)]
    };
  }

  const schemaEventsAgent = async (state: typeof StateAnnotation.State) => {
    const { messages } = state;

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-2024-11-20",
      temperature: 1,
    });

    const stream = model.stream([
      new SystemMessage(schemaEventsPrompt),
      ...messages,
    ]);

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ runningStep: 'schemaEvents' }) })}\n\n`));
    let schemaEvents = '';
    for await (const chunk of await stream) {
      schemaEvents += chunk.content;
      writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'schemaEvents', data: chunk.content })}\n\n`));
    }

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ compeleteStep: 'schemaEvents' }) })}\n\n`));

    const schemaEventsJSON = llmJsonParse(schemaEvents);

    return {
      schemaEvents,
      schemaEventsJSON,
      messages: [...messages, new AIMessage(schemaEvents)]
    };
  }

  const schemaExpressionsAgent = async (state: typeof StateAnnotation.State) => {
    const { messages } = state;

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-2024-11-20",
      temperature: 1,
    });

    const stream = model.stream([
      new SystemMessage(schemaExpressionsPrompt),
      ...messages,
    ]);

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ runningStep: 'schemaExpressions' }) })}\n\n`));
    let schemaExpressions = '';
    for await (const chunk of await stream) {
      schemaExpressions += chunk.content;
      writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'schemaExpressions', data: chunk.content })}\n\n`));
    }

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ compeleteStep: 'schemaExpressions' }) })}\n\n`));
    const schemaExpressionsJSON = llmJsonParse(schemaExpressions);

    return {
      schemaExpressions,
      schemaExpressionsJSON,
      messages: [...messages, new AIMessage(schemaExpressions)]
    };
  }

  const schemaMergeAgent = async (state: typeof StateAnnotation.State) => {
    const {
      messages,
      schemaTypesJSON,
      schemaLayoutsJSON,
      schemaPropsJSON,
      schemaEventsJSON,
      schemaExpressionsJSON,
      querysJSON,
    } = state;

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ runningStep: 'finalSchema' }) })}\n\n`));

    const finalSchemaJSON: IFinalSchema = {};
    const { querys, weights } = schemaExpressionsJSON;
    for (const key in schemaTypesJSON) {
      const weightExpressions = weights[key];
      finalSchemaJSON[key] = {
        type: schemaTypesJSON[key].type,
        parent: schemaTypesJSON[key].parent,
        layout: schemaLayoutsJSON[key]?.layout,
        style: schemaLayoutsJSON[key]?.style,
        props: schemaPropsJSON[key]?.props,
        events: schemaEventsJSON[key],
      };

      if (weightExpressions) {
        finalSchemaJSON[key].props = {
          ...(finalSchemaJSON[key].props || {}),
          ...weightExpressions,
        };
      }
    }

    const finalQuerysJSON: IQuerys = {};
    for (const key in querys) {
      const querysExpressions = querys[key];
      finalQuerysJSON[key] = querys[key];
      if (querysExpressions) {
        finalQuerysJSON[key] = {
          ...(finalQuerysJSON[key] || {}),
          ...querysExpressions,
        };
      }
    }

    const finalSchema = `\`\`\`json\n${JSON.stringify({
      weights: finalSchemaJSON,
      querys: finalQuerysJSON,
    }, null, 2)}\n\`\`\``;

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'finalSchema', data: finalSchema })}\n\n`));

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ compeleteStep: 'finalSchema' }) })}\n\n`));

    return {
      finalSchema,
      finalSchemaJSON,
      messages: [...messages, new AIMessage(finalSchema)]
    };
  }

  const workflow = new StateGraph(StateAnnotation)
    .addNode("sitePlanAgent", sitePlanAgent)
    .addNode("schemaTypesAgent", schemaTypesAgent)
    .addNode('querysAgent', querysAgent)
    .addNode("schemaLayoutsAgent", schemaLayoutsAgent)
    .addNode("schemaPropsAgent", schemaPropsAgent)
    .addNode("schemaEventsAgent", schemaEventsAgent)
    .addNode("schemaExpressionsAgent", schemaExpressionsAgent)
    .addNode("schemaMergeAgent", schemaMergeAgent)
    .addEdge(START, "sitePlanAgent")
    .addEdge("sitePlanAgent", "schemaTypesAgent")
    .addEdge("schemaTypesAgent", "querysAgent")
    .addEdge("querysAgent", "schemaLayoutsAgent")
    .addEdge("schemaLayoutsAgent", "schemaPropsAgent")
    .addEdge("schemaPropsAgent", "schemaEventsAgent")
    .addEdge("schemaEventsAgent", "schemaExpressionsAgent")
    .addEdge("schemaExpressionsAgent", "schemaMergeAgent")
    .addEdge("schemaMergeAgent", END);

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