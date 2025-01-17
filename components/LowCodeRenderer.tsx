import React, { useEffect, useMemo } from 'react';
import useChatStore from '@/store/chatStore';
import { llmJsonParse } from '@/utils';
import { IFinalData, IWeight } from '@/types';
import { weightMaps } from './WeightMaps';
import { createEventHandlers } from '@/utils/event';
import useLowCodeStore from '@/store/lowcodeStore';
import { parseObjectExpressions } from '@/utils/expression';

const ComponentWrapper = (context: { component: React.ComponentType<any>, node: IWeight, name: string, children: React.ReactNode }) => {
  const { component: Component, node, name, children } = context;
  const { layout, style, props = {}, events } = node;

  const expressionContext = useLowCodeStore(state => state.expressionContext);
  const callWeightMethod = useLowCodeStore(state => state.callWeightMethod);
  const updateExpressionContext = useLowCodeStore(state => state.updateExpressionContext);
  const eventHandlers = createEventHandlers(events || {}, callWeightMethod, updateExpressionContext, expressionContext);

  const parsedProps = parseObjectExpressions(props, expressionContext);

  console.log('expressionContext', expressionContext)
  console.log(name, 'parsedProps', parsedProps)

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
  const { messages } = useChatStore();
  const lastAIMessage = messages.findLast((msg) => msg.role === 'ai');

  const updateExpressionContext = useLowCodeStore(state => state.updateExpressionContext);

  const data: IFinalData = useMemo(() => {
    const parsedData = llmJsonParse(lastAIMessage?.artifact?.finalSchema || '{}');
    return typeof parsedData === 'object' && parsedData !== null ? parsedData as IFinalData : {} as IFinalData;
  }, [lastAIMessage?.artifact?.finalSchema]);

  const { weights = {}, querys = {} } = data;

  useEffect(() => {
    Object.keys(querys).forEach(queryName => {
      updateExpressionContext(queryName, {
        ...querys[queryName],
        loading: false,
        data: null,
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