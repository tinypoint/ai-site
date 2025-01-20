import React, { useEffect, useMemo, useRef, useState } from 'react';
import { llmJsonParse } from '@/utils';
import { IFinalData, IWeight, IWeightLayout, IWeightLayoutForRender, Message } from '@/types';
import { weightMaps } from './WeightMaps';
import { createEventHandlers } from '@/utils/event';
import useLowCodeStore from '@/store/lowcodeStore';
import { parseObjectExpressions } from '@/utils/expression';
import { Vessel } from '@opensea/vessel';

const ComponentWrapper = (context: { component: React.ComponentType<any>, node: IWeight, name: string, children: React.ReactNode }) => {
  const { component: Component, node, name, children } = context;
  const { layout, style, props = {}, events } = node;

  const expressionContext = useLowCodeStore(state => state.expressionContext);
  const callWeightMethod = useLowCodeStore(state => state.callWeightMethod);
  const updateExpressionContext = useLowCodeStore(state => state.updateExpressionContext);
  const getExpressionContext = useLowCodeStore(state => state.getExpressionContext);
  const eventHandlers = createEventHandlers(events || {}, callWeightMethod, updateExpressionContext, getExpressionContext);

  const parsedProps = parseObjectExpressions(props, expressionContext);

  if (name.startsWith('Table')) {
    // console.log('expressionContext', expressionContext)
    // console.log(name, 'props', props)
    console.log(name, 'parsedProps', parsedProps)
  }

  return (
    <Component
      name={name}
      layout={layout || {}}
      style={style || {}}
      eventHandlers={eventHandlers}
      {...parsedProps}
    >
      {children}
    </Component >
  )
};

const LowCodeRenderer: React.FC<{}> = ({ }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const vessel = useRef<Vessel | null>(null);

  const lastAIMessage = messages.findLast((msg) => msg.role === 'ai');

  const updateExpressionContext = useLowCodeStore(state => state.updateExpressionContext);

  const data: IFinalData = useMemo(() => {
    const parsedData = llmJsonParse(lastAIMessage?.artifact?.finalSchema || '{}');
    return typeof parsedData === 'object' && parsedData !== null ? parsedData as IFinalData : {} as IFinalData;
  }, [lastAIMessage?.artifact?.finalSchema]);

  const { weights = {}, querys = {} } = data;

  useEffect(() => {
    if (!vessel.current) {
      vessel.current = new Vessel({});
      vessel.current.addListener('message', (message, reply) => {
        if (typeof message.payload === 'object') {
          const payload = message.payload as { type: string, messages: Message[] };
          if (payload.type === 'updateMessages') {
            setMessages(payload.messages);
          }
        }
        const result = 'hi'
        reply(result)
        return true

      })
    }
  }, []);

  useEffect(() => {
    Object.keys(querys).forEach(queryName => {
      updateExpressionContext(queryName, {
        ...querys[queryName],
        loading: false,
        response: null,
        mockResponse: querys[queryName]?.response,
      });
    });

    return () => {
      Object.keys(querys).forEach(queryName => {
        updateExpressionContext(queryName, undefined);
      });
    }

  }, [querys]);

  const renderComponent = (key: string): React.ReactNode => {
    const node = weights[key];
    if (!node) return null;
    const { type } = node;
    const Component = weightMaps[type];
    if (!Component) return null;

    const childrenKeys = Object.keys(weights).filter(childKey => weights[childKey].parent === key);
    let rowStartIndex = 0;
    let topLeiji = 0;
    let maxTopLeiji = 0;
    const childrenList = childrenKeys.sort((a, b) => {
      return (weights[a]?.layout?.rowStartToParentContainer || 0) - (weights[b]?.layout?.rowStartToParentContainer || 0);
    });
    childrenList.reduce<IWeightLayoutForRender | undefined>((prevLayout, childKey) => {
      const currentLayout = weights[childKey]?.layout as IWeightLayoutForRender;
      if (currentLayout) {
        if (weights[childKey].type !== 'Modal') {
          if (prevLayout) {
            if (currentLayout.rowStartToParentContainer >= (prevLayout.rowStartToParentContainer + prevLayout.rowSpanToParentContainer)) {
              rowStartIndex += 1
              currentLayout.gridRow = rowStartIndex
              topLeiji = maxTopLeiji
              currentLayout.rowStartToParentContainerWithDiff = currentLayout.rowStartToParentContainer - topLeiji
              maxTopLeiji = currentLayout.rowStartToParentContainer + currentLayout.rowSpanToParentContainer
            } else {
              currentLayout.gridRow = prevLayout.gridRow
              currentLayout.rowStartToParentContainerWithDiff = currentLayout.rowStartToParentContainer - topLeiji
              if (currentLayout.rowStartToParentContainer + currentLayout.rowSpanToParentContainer > maxTopLeiji) {
                maxTopLeiji = currentLayout.rowStartToParentContainer + currentLayout.rowSpanToParentContainer
              }
            }
          } else {
            rowStartIndex += 1
            currentLayout.gridRow = rowStartIndex
            currentLayout.rowStartToParentContainerWithDiff = currentLayout.rowStartToParentContainer;
            maxTopLeiji = currentLayout.rowStartToParentContainer + currentLayout.rowSpanToParentContainer;
          }
        } else {
          return prevLayout;
        }
      }
      return currentLayout || prevLayout;
    }, undefined);
    return (
      <ComponentWrapper component={Component} node={node} name={key} key={key}>
        {childrenKeys.map(renderComponent)}
      </ComponentWrapper>
    );
  };

  const rootComponents = Object.keys(weights).filter(key => weights[key].parent == null);

  return (
    <div className="low-code-renderer">
      {rootComponents.map(renderComponent)}
    </div>
  );
};

export default LowCodeRenderer; 