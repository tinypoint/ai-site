"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { llmJsonParse, transformWeightsMapToTree } from '@/utils';
import { IFinalData, IWeight, IWeightLayout, IWeightLayoutForRender, IWeightTreeNode, Message } from '@/types';
import { weightMaps } from './WeightMaps';
import { createEventHandlers } from '@/utils/event';
import useLowCodeStore from '@/hooks/useLowCodeStore';
import { parseObjectExpressions } from '@/utils/expression';
import { ReplyOptions, Vessel, VesselMessage } from '@opensea/vessel';

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
    }

    vessel.current?.send({
      type: 'iframeReady',
    }).then((res) => {
      setMessages(res as unknown as Message[]);
    }).catch((err) => {
    });
    const listener = (message: VesselMessage<unknown>, reply: (response?: unknown, options?: ReplyOptions) => void) => {
      if (typeof message.payload === 'object') {
        const payload = message.payload as { type: string, messages: Message[] };
        if (payload.type === 'updateMessages') {
          setMessages(payload.messages);
        }
      }
      const result = 'hi'
      reply(result)
      return true
    }
    vessel.current.addListener('message', listener);

    return () => {
      vessel.current?.removeListener('message', listener);
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

  const rootWeight = useMemo(() => transformWeightsMapToTree(weights), [weights]);

  const renderComponent = (node: IWeightTreeNode): React.ReactNode => {
    const { name, type, children } = node;
    const Component = weightMaps[type];
    if (!Component) return null;

    const childrenKeys = Object.keys(weights).filter(childKey => weights[childKey].parent === name);
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
      <ComponentWrapper component={Component} node={node} name={name} key={name}>
        {(children || []).map(renderComponent)}
      </ComponentWrapper>
    );
  };

  return (
    <div className="low-code-renderer">
      {rootWeight && renderComponent(rootWeight)}
    </div>
  );
};

export default LowCodeRenderer; 