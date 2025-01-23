

import { toast } from "sonner"

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

export function createEventHandlers(
  eventObject: { [key: string]: EventData },
  callWeightMethod: (method: string, ...args: any[]) => void,
  updateState: (name: string, state: any) => void,
  getExpressionContext: (name: string) => any,
) {
  const handlers: { [key: string]: () => void } = {};

  for (const eventName in eventObject) {
    const eventData = eventObject[eventName];
    const nodeMap = new Map<string, Node>();
    (eventData.nodes || []).forEach(node => nodeMap.set(node.id, node));

    const executeNode = (nodeId: string) => {
      const node = nodeMap.get(nodeId);
      if (!node) return;

      switch (node.type) {
        case 'start':
          // Start node logic
          break;
        case 'executeQuery':
          // Execute query logic



          const expressionContext = { ...(getExpressionContext(node.options.queryName) || {}) };
          console.log(`Executing query: ${node.options.queryName}`, expressionContext);

          updateState(node.options.queryName, {
            ...expressionContext,
            loading: true,
            response: null,
          });

          try {
            const url = expressionContext.method.toLowerCase() === 'get' ? expressionContext.url + '?' + new URLSearchParams(expressionContext.params) : expressionContext.url;


            fetch(url, {
              method: expressionContext.method,
              body: expressionContext.method.toLowerCase() === 'get' ? undefined : JSON.stringify(expressionContext.body),
            }).then(response => response.json()).then(data => {
              console.log('response', data);
            }).catch(error => {
              console.log('Error fetching data:', error);
            });
          } catch (error) {
            console.log('Error fetching data:', error);
          }

          setTimeout(() => {
            updateState(node.options.queryName, {
              ...expressionContext,
              loading: false,
              response: expressionContext.mockResponse,
            });
            console.log({
              ...expressionContext,
              loading: false,
              response: expressionContext.mockResponse,
            });
          }, 1000);
          break;
        case 'setComponentProps':
          // Set component properties logic
          console.log(`Setting props for: ${node.options.weightName}`);
          break;
        case 'toast':
          toast(node.options.message);
          // message.info(node.options.message, node.options.duration);
          break;
        case 'controlComponent':
          // Control component logic
          console.log(`Controlling component: ${node.options.weightName}`);
          callWeightMethod(node.options.weightName, node.options.method, node.options.args);
          break;
        default:
          console.warn(`Unknown node type: ${node.type}`);
      }

      // Find and execute next nodes
      (eventData.edges || []).filter(edge => edge.source.id === nodeId && edge.source.outputHandle === 'next')
        .forEach(edge => executeNode(edge.target.id));
    };

    handlers[eventName] = () => {
      executeNode('start');
    };
  }

  return handlers;
}

