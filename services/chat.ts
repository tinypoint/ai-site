import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatDeepSeek } from "@/services/common/deepseek";
import { schemaPropsPrompt } from "@/constants/prompt/schemaProps";
import { schemaLayoutPrompt } from "@/constants/prompt/schemaLayouts";
import { llmJsonParse, mergeObjects } from "@/utils";
import type { ISchemaProps, ISchemaLayout, IFinalSchema, ISchemaEvents, ISchemaExpressions, IQuerys, IQueryMockResponse } from "@/types";
import { planPrompt } from "@/constants/prompt/plan";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { queryMockResponsePrompt, queryPrompt } from "@/constants/prompt/query";
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
  queryMockResponse: Annotation<string>({
    value: () => '',
  }),
  queryMockResponseJSON: Annotation<IQueryMockResponse>({
    value: () => ({} as IQueryMockResponse),
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

    const model = new ChatDeepSeek({
      temperature: 1,
    });

    const stream = model.stream([
      new SystemMessage(planPrompt),
      ...messages,
      new HumanMessage('请输出站点规划')
    ]);

    let sitePlan = '';
    for await (const chunk of await stream) {
      sitePlan += chunk.content;
      writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'plan', data: chunk.content })}\n\n`));
    }

    return {
      sitePlan,
    };
  }

  const querysAgent = async (state: typeof StateAnnotation.State) => {
    const { messages, sitePlan } = state;
    const model = new ChatDeepSeek({
      temperature: 1,
    });

    const stream = model.stream([
      new SystemMessage(queryPrompt),
      ...messages,
      new AIMessage(sitePlan),
      new HumanMessage('请按照规划，生成页面请求映射表')
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
    };
  }

  // const schemaTypesAgent = async (state: typeof StateAnnotation.State) => {
  //   const { messages, sitePlan, querys } = state;

  //   const model = new ChatDeepSeek({
  //     temperature: 1,
  //   });

  //   const stream = model.stream([
  //     new SystemMessage(schemaTypesPrompt),
  //     ...messages,
  //     new AIMessage(sitePlan),
  //     new HumanMessage('请按照规划，生成页面请求映射表'),
  //     new AIMessage(querys),
  //     new HumanMessage('请按照规划和请求映射表，生成组件类型和组件父级映射表')
  //   ]);
  //   writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ runningStep: 'schemaTypes' }) })}\n\n`));
  //   let schemaTypes = '';
  //   for await (const chunk of await stream) {
  //     schemaTypes += chunk.content;
  //     writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'schemaTypes', data: chunk.content })}\n\n`));
  //   }
  //   writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ compeleteStep: 'schemaTypes' }) })}\n\n`));

  //   const schemaTypesJSON = llmJsonParse(schemaTypes);
  //   const finalSchemaJSON: IFinalSchema = {};
  //   for (const key in schemaTypesJSON) {
  //     finalSchemaJSON[key] = {
  //       type: schemaTypesJSON[key].type,
  //       parent: schemaTypesJSON[key].parent,
  //     };
  //   }

  //   return {
  //     schemaTypes,
  //     schemaTypesJSON,
  //     finalSchemaJSON,
  //   };
  // }

  const schemaLayoutsAgent = async (state: typeof StateAnnotation.State) => {
    const { messages, sitePlan, querys } = state;

    const model = new ChatDeepSeek({
      temperature: 1,
    });

    const stream = model.stream([
      new SystemMessage(schemaLayoutPrompt),
      ...messages,
      new AIMessage(sitePlan),
      new HumanMessage('请按照规划，生成页面请求映射表'),
      new AIMessage(querys),
      new HumanMessage('请按照规划、请求映射表，生成组件类型、组件父级、组件布局和组件样式映射表')
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
    };
  }

  const schemaPropsAgent = async (state: typeof StateAnnotation.State) => {
    const { messages, sitePlan, querys, schemaLayouts } = state;

    const model = new ChatDeepSeek({
      temperature: 1,
    });
    const stream = model.stream([
      new SystemMessage(schemaPropsPrompt),
      ...messages,
      new AIMessage(sitePlan),
      new HumanMessage('请按照规划，生成页面请求映射表'),
      new AIMessage(querys),
      new HumanMessage('请按照规划、请求映射表，生成组件类型，组件父级，组件布局和组件样式映射表'),
      new AIMessage(schemaLayouts),
      new HumanMessage('请按照规划、请求映射表、组件映射表，生成组件属性映射表')
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
    };
  }

  const schemaEventsAgent = async (state: typeof StateAnnotation.State) => {
    const { messages, sitePlan, querys, schemaLayouts, schemaProps } = state;

    const model = new ChatDeepSeek({
      temperature: 1,
    });

    const stream = model.stream([
      new SystemMessage(schemaEventsPrompt),
      ...messages,
      new AIMessage(sitePlan),
      new HumanMessage('请按照规划，生成页面请求映射表'),
      new AIMessage(querys),
      new HumanMessage('请按照规划和请求映射表，生成组件类型和组件父级映射表'),
      new AIMessage(schemaLayouts),
      new HumanMessage('请按照规划、请求映射表、组件映射表，生成组件属性映射表'),
      new AIMessage(schemaProps),
      new HumanMessage('请按照规划、请求映射表、组件映射表、组件属性映射表，生成组件事件映射表')
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
    };
  }

  const queryMockResponseAgent = async (state: typeof StateAnnotation.State) => {
    const { messages, sitePlan, querys, schemaLayouts, schemaProps, schemaEvents } = state;

    const model = new ChatDeepSeek({
      temperature: 1,
    });

    const stream = model.stream([
      new SystemMessage(queryMockResponsePrompt),
      ...messages,
      new AIMessage(sitePlan),
      new HumanMessage('请按照规划，生成页面请求映射表'),
      new AIMessage(querys),
      new HumanMessage('请按照规划和请求映射表，生成组件类型和组件父级映射表'),
      new AIMessage(schemaLayouts),
      new HumanMessage('请按照规划、请求映射表、组件映射表，生成组件属性映射表'),
      new AIMessage(schemaProps),
      new HumanMessage('请按照规划、请求映射表、组件映射表、组件属性映射表，生成组件事件映射表'),
      new AIMessage(schemaEvents),
      new HumanMessage('请按照规划、请求映射表、组件映射表、组件属性映射表、组件事件映射表、，生成请求mock响应数据的映射表')
    ]);

    let queryMockResponse = '';

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ runningStep: 'queryMockResponse' }) })}\n\n`));
    for await (const chunk of await stream) {
      queryMockResponse += chunk.content;
      writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'queryMockResponse', data: chunk.content })}\n\n`));
    }
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ compeleteStep: 'queryMockResponse' }) })}\n\n`));

    const queryMockResponseJSON = llmJsonParse(queryMockResponse);

    return {
      queryMockResponse,
      queryMockResponseJSON,
    };
  }

  const schemaExpressionsAgent = async (state: typeof StateAnnotation.State) => {
    const { messages, sitePlan, schemaLayouts, schemaProps, schemaEvents, querys, queryMockResponse } = state;

    const model = new ChatDeepSeek({
      temperature: 1,
    });

    const stream = model.stream([
      new SystemMessage(schemaExpressionsPrompt),
      ...messages,
      new AIMessage(sitePlan),
      new HumanMessage('请按照规划，生成页面请求映射表'),
      new AIMessage(querys),
      new HumanMessage('请按照规划和请求映射表，生成组件类型和组件父级映射表'),
      new AIMessage(schemaLayouts),
      new HumanMessage('请按照规划、请求映射表、组件映射表，生成组件属性映射表'),
      new AIMessage(schemaProps),
      new HumanMessage('请按照规划、请求映射表、组件映射表、组件属性映射表，生成组件事件映射表'),
      new AIMessage(schemaEvents),
      new HumanMessage('请按照规划、请求映射表、组件映射表、组件属性映射表、组件事件映射表、，生成请求mock响应数据的映射表'),
      new AIMessage(queryMockResponse),
      new HumanMessage('请按照规划、请求映射表、组件映射表、组件属性映射表、组件事件映射表、请求mock响应数据的映射表，生成组件和请求的表达式映射表')
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
    };
  }

  const schemaMergeAgent = async (state: typeof StateAnnotation.State) => {
    const {
      schemaLayoutsJSON,
      schemaPropsJSON,
      schemaEventsJSON,
      schemaExpressionsJSON,
      querysJSON,
      queryMockResponseJSON
    } = state;

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ runningStep: 'finalSchema' }) })}\n\n`));

    const finalSchemaJSON: IFinalSchema = {};
    const { querys, weights } = schemaExpressionsJSON;
    for (const key in schemaLayoutsJSON) {
      const weightExpressions = weights[key];
      finalSchemaJSON[key] = {
        type: schemaLayoutsJSON[key].type,
        parent: schemaLayoutsJSON[key].parent,
        layout: schemaLayoutsJSON[key]?.layout,
        style: schemaLayoutsJSON[key]?.style,
        props: schemaPropsJSON[key]?.props,
        events: schemaEventsJSON[key],
      };

      if (weightExpressions) {
        finalSchemaJSON[key].props = mergeObjects({ ...(finalSchemaJSON[key].props || {}) }, weightExpressions);
      }
    }

    const finalQuerysJSON: IQuerys = {};
    for (const key in querysJSON) {
      const querysExpressions = querys[key];
      finalQuerysJSON[key] = {
        ...querysJSON[key],
        ...queryMockResponseJSON[key],
      };
      if (querysExpressions) {
        finalQuerysJSON[key] = mergeObjects({ ...(finalQuerysJSON[key] || {}) }, querysExpressions);
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
    };
  }

  const workflow = new StateGraph(StateAnnotation)
    .addNode("sitePlanAgent", sitePlanAgent)
    .addNode('querysAgent', querysAgent)
    .addNode("schemaLayoutsAgent", schemaLayoutsAgent)
    .addNode("schemaPropsAgent", schemaPropsAgent)
    .addNode("schemaEventsAgent", schemaEventsAgent)
    .addNode("queryMockResponseAgent", queryMockResponseAgent)
    .addNode("schemaExpressionsAgent", schemaExpressionsAgent)
    .addNode("schemaMergeAgent", schemaMergeAgent)
    .addEdge(START, "sitePlanAgent")
    .addEdge("sitePlanAgent", "querysAgent")
    .addEdge("querysAgent", "schemaLayoutsAgent")
    .addEdge("schemaLayoutsAgent", "schemaPropsAgent")
    .addEdge("schemaPropsAgent", "schemaEventsAgent")
    .addEdge("schemaEventsAgent", "queryMockResponseAgent")
    .addEdge("queryMockResponseAgent", "schemaExpressionsAgent")
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