
import { message } from 'antd';

interface Node {
  id: string;
  type: string;
  options?: any;
  inputHandle?: string[];
  outputHandle?: string[];
}

interface Edge {
  source: {
    id: string;
    outputHandle: string;
  };
  target: {
    id: string;
    inputHandle: string;
  };
}

interface EventData {
  nodes: Node[];
  edges: Edge[];
}

export function createEventHandlers(eventObject: { [key: string]: EventData }) {
  const handlers: { [key: string]: () => void } = {};

  for (const eventName in eventObject) {
    const eventData = eventObject[eventName];
    const nodeMap = new Map<string, Node>();
    eventData.nodes.forEach(node => nodeMap.set(node.id, node));

    const executeNode = (nodeId: string, context: any) => {
      const node = nodeMap.get(nodeId);
      if (!node) return;

      switch (node.type) {
        case 'start':
          // Start node logic
          break;
        case 'executeQuery':
          // Execute query logic
          console.log(`Executing query: ${node.options.queryName}`);
          context[node.id] = { data: 'mockData' }; // Mock response
          break;
        case 'setComponentProps':
          // Set component properties logic
          console.log(`Setting props for: ${node.options.weightName}`);
          break;
        case 'toast':
          message.info(node.options.message, node.options.duration);
          break;
        case 'controlComponent':
          // Control component logic
          console.log(`Controlling component: ${node.options.weightName}`);
          break;
        default:
          console.warn(`Unknown node type: ${node.type}`);
      }

      // Find and execute next nodes
      eventData.edges
        .filter(edge => edge.source.id === nodeId && edge.source.outputHandle === 'next')
        .forEach(edge => executeNode(edge.target.id, context));
    };

    handlers[eventName] = () => {
      const context: any = {};
      executeNode('start', context);
    };
  }

  return handlers;
}

