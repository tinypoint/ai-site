import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Chat } from "@/services/common/deepseek";
import { schemaLayoutPrompt } from "@/constants/prompt/schemaLayouts";
import { llmJsonParse } from "@/utils";
import type { ISchemaLayout, ISchemaEvents, ISchemaExpressions, IQuerys, IQueryMockResponse, INavigation } from "@/types";
import { planPrompt, routesPrompt, navigationPrompt } from "@/constants/prompt/plan";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { queryMockResponsePrompt, queryPrompt } from "@/constants/prompt/query";
import { schemaEventsPrompt } from "@/constants/prompt/schemaEvents";
import { schemaExpressionsPrompt } from "@/constants/prompt/schemaExpressions";
import { schemaMerge } from "@/utils/schema";

const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    value: () => [] as BaseMessage[],
    reducer: (_left: BaseMessage[], right: BaseMessage[]) => {
      return [...right]
    }
  }),
  systemDescription: Annotation<string>,
  navigation: Annotation<string>,
  navigationJSON: Annotation<INavigation>,
  currentPageId: Annotation<string>,
  pageDescription: Annotation<string>,
  querys: Annotation<string>,
  querysJSON: Annotation<IQuerys>,
  schemaLayouts: Annotation<string>,
  schemaLayoutsJSON: Annotation<ISchemaLayout>,
  schemaEvents: Annotation<string>,
  schemaEventsJSON: Annotation<ISchemaEvents>,
  queryMockResponse: Annotation<string>,
  queryMockResponseJSON: Annotation<IQueryMockResponse>,
  schemaExpressions: Annotation<string>,
  schemaExpressionsJSON: Annotation<ISchemaExpressions>,
  final: Annotation<string>,
  finalJSON: Annotation<string>,
});
export const schemaAgent = async (messages: BaseMessage[], writer: WritableStreamDefaultWriter<Uint8Array>) => {
  const siteAgent = async (state: typeof StateAnnotation.State) => {
    const { messages } = state;

    const model = new Chat({
      temperature: 1.3,
    });

    const stream = model.stream([
      new SystemMessage(routesPrompt),
      ...messages,
    ]);

    let systemDescription = '';
    for await (const chunk of await stream) {
      if (chunk.content) {
        systemDescription += chunk.content;
        writer.write(new TextEncoder().encode(`data: ${JSON.stringify({
          type: 'systemDescription',
          data: chunk.content
        })}\n\n`));
      }
    }

    {
      const stream = model.stream([
        new SystemMessage(navigationPrompt),
        ...messages,
        new AIMessage(systemDescription),
        new HumanMessage(`生成详细的页面路由，用json返回`)
      ]);
      writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ runningStep: 'navigation' }) })}\n\n`));
      let navigation = '';
      for await (const chunk of await stream) {
        if (chunk.content) {
          navigation += chunk.content;
          writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'navigation', data: chunk.content })}\n\n`));
        }
      }
      writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ compeleteStep: 'navigation' }) })}\n\n`));
      const navigationJSON = llmJsonParse(navigation) as INavigation;
      const homePage = navigationJSON?.routes?.find((item) => item.isHome);

      return {
        systemDescription,
        navigation,
        navigationJSON,
        currentPageId: homePage?.pageId,
      }
    }
  }


  const pageAgent = async (state: typeof StateAnnotation.State) => {
    const { messages, systemDescription, navigation, navigationJSON, currentPageId } = state;

    const model = new Chat({
      temperature: 1.3,
    });

    const route = navigationJSON?.routes?.find((item) => item.pageId === currentPageId);

    const stream = model.stream([
      new SystemMessage(planPrompt),
      ...messages,
      new AIMessage(`${systemDescription}\n详细页面路由为${navigation}`),
      new HumanMessage(`介绍页面"${route?.title}"的功能，接口请求，组件，组件布局，组件属性，数据绑定关系，组件事件`)
    ]);

    let pageDescription = '';
    for await (const chunk of await stream) {
      if (chunk.content) {
        pageDescription += chunk.content;
        writer.write(new TextEncoder().encode(`data: ${JSON.stringify({
          type: 'pageDescription',
          pageId: route?.pageId,
          data: chunk.content
        })}\n\n`));
      }
    }
    return {
      pageDescription,
    };
  }

  const querysAgent = async (state: typeof StateAnnotation.State) => {
    const { messages, systemDescription, navigation, navigationJSON, currentPageId, pageDescription } = state;
    const model = new Chat({
      temperature: 0,
    });

    const route = navigationJSON?.routes?.find((item) => item.pageId === currentPageId);

    const stream = model.stream([
      new SystemMessage(queryPrompt),
      ...messages,
      new AIMessage(`${systemDescription}\n详细页面路由为${navigation}`),
      new HumanMessage(`介绍页面"${route?.title}"的功能，接口请求，组件，组件布局，组件属性，数据绑定关系，组件事件`),
      new AIMessage(`${pageDescription}`),
      new HumanMessage(`列出页面"${route?.title}"中需要用到全部接口请求`)
    ]);

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({
      type: 'progress',
      pageId: route?.pageId,
      data: JSON.stringify({ runningStep: 'querys' })
    })}\n\n`));
    let querys = '';
    for await (const chunk of await stream) {
      if (chunk.content) {
        querys += chunk.content;
        writer.write(new TextEncoder().encode(`data: ${JSON.stringify({
          type: 'querys',
          pageId: route?.pageId,
          data: chunk.content
        })}\n\n`));
      }
    }
    const querysJSON = llmJsonParse(querys);
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({
      type: 'progress',
      pageId: route?.pageId,
      data: JSON.stringify({ compeleteStep: 'querys' })
    })}\n\n`));

    return {
      querys,
      querysJSON,
    };
  }

  const schemaLayoutsAgent = async (state: typeof StateAnnotation.State) => {
    const { messages, systemDescription, navigation, navigationJSON, currentPageId, pageDescription } = state;

    const model = new Chat({
      temperature: 0,
    });

    const route = navigationJSON?.routes?.find((item) => item.pageId === currentPageId);

    const stream = model.stream([
      new SystemMessage(schemaLayoutPrompt),
      ...messages,
      new AIMessage(`${systemDescription}\n详细页面路由为${navigation}`),
      new HumanMessage(`介绍页面"${route?.title}"的功能，接口请求，组件，组件布局，组件属性，数据绑定关系，组件事件`),
      new AIMessage(`${pageDescription}`),
      new HumanMessage(`列出页面"${route?.title}"中需要的全部组件，并为每个组件设置唯一名称、类型、父子关系，并为组件设置精美的布局，保证页面整体美观，以及合理设置组件的属性`),
    ]);
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({
      type: 'progress',
      pageId: route?.pageId,
      data: JSON.stringify({ runningStep: 'schemaLayouts' })
    })}\n\n`));
    let schemaLayouts = '';
    for await (const chunk of await stream) {
      if (chunk.content) {
        schemaLayouts += chunk.content;
        writer.write(new TextEncoder().encode(`data: ${JSON.stringify({
          type: 'schemaLayouts',
          pageId: route?.pageId,
          data: chunk.content
        })}\n\n`));
      }
    }
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({
      type: 'progress',
      pageId: route?.pageId,
      data: JSON.stringify({ compeleteStep: 'schemaLayouts' })
    })}\n\n`));
    const schemaLayoutsJSON = llmJsonParse(schemaLayouts);

    return {
      schemaLayouts,
      schemaLayoutsJSON,
    }
  }

  const layoutsAndQuerysAgent = async (state: typeof StateAnnotation.State) => {
    const [
      {
        schemaLayouts,
        schemaLayoutsJSON,
      },
      {
        querys,
        querysJSON,
      }] = await Promise.all([
        schemaLayoutsAgent(state),
        querysAgent(state),
      ]);

    const finalJSON = schemaMerge({
      schemaExpressionsJSON: { querys: {}, weights: {} },
      schemaLayoutsJSON,
      schemaEventsJSON: {},
      querysJSON,
      queryMockResponseJSON: {}
    });

    const nextFinal = `\`\`\`json\n${JSON.stringify(finalJSON)}\n\`\`\``;
    const nextFinalView = `\`\`\`json\n${JSON.stringify(finalJSON, null, 2)}\n\`\`\``;
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'finalJSON', data: nextFinalView })}\n\n`));

    return {
      schemaLayouts,
      schemaLayoutsJSON,
      querys,
      querysJSON,
      final: nextFinal,
      finalJSON,
    }
  }

  const queryMockResponseAgent = async (state: typeof StateAnnotation.State) => {
    const { messages, pageDescription, final } = state;

    const model = new Chat({
      temperature: 0.3,
    });

    const stream = model.stream([
      new SystemMessage(queryMockResponsePrompt),
      ...messages,
      new AIMessage(`站点的总体规划为：\n${pageDescription}\n
网页中的接口请求和组件为：\n${final}\n
`),
      new HumanMessage(`现在开始进行步骤四：为所有接口请求生成合理的 mock 数据`)
    ]);

    let queryMockResponse = '';

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ runningStep: 'queryMockResponse' }) })}\n\n`));
    for await (const chunk of await stream) {
      if (chunk.content) {
        queryMockResponse += chunk.content;
        writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'queryMockResponse', data: chunk.content })}\n\n`));
      }
    }
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ compeleteStep: 'queryMockResponse' }) })}\n\n`));

    const queryMockResponseJSON = llmJsonParse(queryMockResponse);

    return {
      queryMockResponse,
      queryMockResponseJSON,
    };
  }

  const schemaEventsAgent = async (state: typeof StateAnnotation.State) => {
    const { messages, pageDescription, final } = state;

    const model = new Chat({
      temperature: 0,
    });
    const stream = model.stream([
      new SystemMessage(schemaEventsPrompt),
      ...messages,
      new AIMessage(`站点的总体规划为：\n${pageDescription}\n
网页中的接口请求和组件为：\n${final}\n
`),
      new HumanMessage(`现在开始进行步骤五：为所有组件设置合理的事件，事件的触发条件和事件的触发行为`)
    ]);

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ runningStep: 'schemaEvents' }) })}\n\n`));
    let schemaEvents = '';
    for await (const chunk of await stream) {
      if (chunk.content) {
        schemaEvents += chunk.content;
        writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'schemaEvents', data: chunk.content })}\n\n`));
      }
    }

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ compeleteStep: 'schemaEvents' }) })}\n\n`));

    const schemaEventsJSON = llmJsonParse(schemaEvents);

    return {
      schemaEvents,
      schemaEventsJSON,
    };
  }

  const eventsAndMockResponse = async (state: typeof StateAnnotation.State) => {
    const { querysJSON, schemaLayoutsJSON } = state;

    const [{
      schemaEvents,
      schemaEventsJSON,
    }, {
      queryMockResponse,
      queryMockResponseJSON,
    }] = await Promise.all([
      schemaEventsAgent(state),
      queryMockResponseAgent(state),
    ])

    const finalJSON = schemaMerge({
      schemaExpressionsJSON: { querys: {}, weights: {} },
      schemaLayoutsJSON,
      schemaEventsJSON,
      querysJSON,
      queryMockResponseJSON,
    });

    const nextFinal = `\`\`\`json\n${JSON.stringify(finalJSON)}\n\`\`\``;
    const nextFinalView = `\`\`\`json\n${JSON.stringify(finalJSON, null, 2)}\n\`\`\``;
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'finalJSON', data: nextFinalView })}\n\n`));

    return {
      schemaEvents,
      schemaEventsJSON,
      queryMockResponse,
      queryMockResponseJSON,
      final: nextFinal,
      finalJSON,
    }
  }

  const schemaExpressionsAgent = async (state: typeof StateAnnotation.State) => {
    const { messages, pageDescription, final, schemaLayoutsJSON, querysJSON, querys, schemaEventsJSON, queryMockResponseJSON } = state;

    const model = new Chat({
      temperature: 0,
    });

    const stream = model.stream([
      new SystemMessage(schemaExpressionsPrompt),
      ...messages,
      new AIMessage(`站点的总体规划为：\n${pageDescription}\n
网页中的接口请求和组件为：\n${final}\n
`),
      new HumanMessage(`现在开始进行步骤六：为所有的接口请求的参数、url、请求体 和 所有组件的属性，设置合理的表达式用于进行数据关联`)
    ]);

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ runningStep: 'schemaExpressions' }) })}\n\n`));
    let schemaExpressions = '';
    for await (const chunk of await stream) {
      if (chunk.content) {
        schemaExpressions += chunk.content;
        writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'schemaExpressions', data: chunk.content })}\n\n`));
      }
    }

    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'progress', data: JSON.stringify({ compeleteStep: 'schemaExpressions' }) })}\n\n`));
    const schemaExpressionsJSON = llmJsonParse(schemaExpressions);

    const finalJSON = schemaMerge({
      schemaExpressionsJSON,
      schemaLayoutsJSON,
      schemaEventsJSON,
      querysJSON,
      queryMockResponseJSON
    });

    const nextFinal = `\`\`\`json\n${JSON.stringify(finalJSON)}\n\`\`\``;
    const nextFinalView = `\`\`\`json\n${JSON.stringify(finalJSON, null, 2)}\n\`\`\``;
    writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'finalJSON', data: nextFinalView })}\n\n`));

    return {
      schemaExpressions,
      schemaExpressionsJSON,
      final: nextFinal,
      finalJSON
    };
  }

  const workflow = new StateGraph(StateAnnotation)
    .addNode("siteAgent", siteAgent)
    .addNode("pageAgent", pageAgent)
    .addNode("layoutsAndQuerysAgent", layoutsAndQuerysAgent)
    .addEdge(START, "siteAgent")
    .addEdge("siteAgent", "pageAgent")
    .addEdge("pageAgent", "layoutsAndQuerysAgent")
    .addEdge("layoutsAndQuerysAgent", END);

  const app = workflow.compile({});

  const stream = await app.stream(
    { messages: [...messages] },
    { configurable: { thread_id: "42" } }
  );

  for await (const chunk of stream) {
    // console.log(chunk);
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