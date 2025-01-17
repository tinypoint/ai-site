import React, { useMemo } from 'react';
import useChatStore from '@/store/chatStore';
import { llmJsonParse } from '@/utils';
import { IFinalSchema } from '@/types';
import { weightMaps } from './WeightMaps';
import { createEventHandlers } from '@/utils/event';

const LowCodeRenderer: React.FC<{}> = ({ }) => {
  const { messages } = useChatStore();
  const lastAIMessage = messages.findLast((msg) => msg.role === 'ai');

  const data = useMemo(() => {
    const parsedData = llmJsonParse(lastAIMessage?.artifact?.finalSchema || '{}');
    return typeof parsedData === 'object' && parsedData !== null ? parsedData as IFinalSchema : {};
  }, [lastAIMessage?.artifact?.finalSchema]);

  const renderComponent = (key: string): React.ReactNode => {
    const node = data[key];
    if (!node) return null;
    const { type, props, layout, style, events } = node;
    const Component = weightMaps[type];
    if (!Component) return null;

    const childrenKeys = Object.keys(data).filter(childKey => data[childKey].parent === key);
    const eventHandlers = createEventHandlers(events || {});
    return (
      <Component key={key} {...props} layout={layout || {}} style={style || {}} eventHandlers={eventHandlers}>
        {childrenKeys.map(renderComponent)}
      </Component>
    );
  };

  const rootComponents = Object.keys(data).filter(key => data[key].parent == null);

  return (
    <div className="low-code-renderer">
      {rootComponents.map(renderComponent)}
    </div>
  );
};

export default LowCodeRenderer; 