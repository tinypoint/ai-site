
import { Message, AIMessage } from '@/types';
import { llmJsonParse } from '@/utils';
import { schemaMerge } from '@/utils/schema';
import { create } from "zustand";

export interface User {
  id: number;
  avatar: string;
  messages: Message[];
  name: string;
}

interface State {
  input: string;
  messages: Message[];
}

interface Actions {
  selectedUser: any;
  setInput: (input: string) => void;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  setMessages: (fn: (messages: Message[]) => Message[]) => void;
  parseStreamResponse: (reader: ReadableStreamDefaultReader<Uint8Array>) => void;
  getLastAIMessage: () => AIMessage | undefined;
}

const useChatStore = create<State & Actions>()((set, get) => ({
  selectedUser: {
    id: 4,
    avatar:
      "https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg?fmt=webp&h=350",
    messages: [],
    name: "John Smith",
  },

  input: "",

  setInput: (input) => set({ input }),
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => set({ input: e.target.value }),

  messages: [],
  setMessages: (fn) => set(({ messages }) => ({ messages: fn(messages) })),
  parseStreamResponse: async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const decoder = new TextDecoder();
    let buffer = '';
    let aiMessageReceived: {
      pages: Record<string, {
        pageDescription?: string;
        querys?: string;
        schemaLayouts?: string;
        queryMockResponse?: string;
        schemaEvents?: string;
        schemaExpressions?: string;
        runningSteps: string[];
        compeleteSteps: string[];
        [key: string]: any;
      }>
      systemDescription?: string;
      navigation?: string;
      runningSteps: string[];
      compeleteSteps: string[];
      [key: string]: any;
    } = {
      pages: {},
      systemDescription: '',
      navigation: '',
      runningSteps: [],
      compeleteSteps: []
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf('\n\n');
      while (boundary !== -1) {
        const chunk = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);

        if (chunk.startsWith('data: ')) {
          const jsonData = JSON.parse(chunk.slice(6)) as { type: string, data: string, pageId?: string };
          set((state) => {
            const updatedMessages = [...state.messages];
            const lastAIMessage = updatedMessages.findLast((content) => content.role === 'ai');
            if (lastAIMessage) {
              if (jsonData.pageId) {
                if (aiMessageReceived.pages[jsonData.pageId] === undefined) {
                  aiMessageReceived.pages[jsonData.pageId] = {
                    runningSteps: [],
                    compeleteSteps: []
                  };
                }
                if (jsonData.type === 'progress') {
                  const { runningStep, compeleteStep } = JSON.parse(jsonData.data);
                  if (runningStep) {
                    aiMessageReceived.pages[jsonData.pageId].runningSteps.push(runningStep);
                  }
                  if (compeleteStep) {
                    aiMessageReceived.pages[jsonData.pageId].runningSteps = aiMessageReceived.pages[jsonData.pageId].runningSteps.filter((step) => step !== compeleteStep);
                    aiMessageReceived.pages[jsonData.pageId].compeleteSteps.push(compeleteStep);
                  }
                } else {
                  if (aiMessageReceived.pages[jsonData.pageId][jsonData.type] === undefined) {
                    aiMessageReceived.pages[jsonData.pageId][jsonData.type] = '';
                  }
                  // pageDescription querys layouts mockData events expressions
                  aiMessageReceived.pages[jsonData.pageId][jsonData.type] += jsonData.data;
                  const dsl = schemaMerge({
                    querysJSON: llmJsonParse(aiMessageReceived.pages[jsonData.pageId].querys || '{}'),
                    schemaLayoutsJSON: llmJsonParse(aiMessageReceived.pages[jsonData.pageId].schemaLayouts || '{}'),
                    queryMockResponseJSON: llmJsonParse(aiMessageReceived.pages[jsonData.pageId].queryMockResponse || '{}'),
                    schemaEventsJSON: llmJsonParse(aiMessageReceived.pages[jsonData.pageId].schemaEvents || '{}'),
                    schemaExpressionsJSON: llmJsonParse(aiMessageReceived.pages[jsonData.pageId].schemaExpressions || '{}'),
                  });
                  aiMessageReceived.pages[jsonData.pageId].dsl = dsl;
                }
              } else {
                if (jsonData.type === 'progress') {
                  const { runningStep, compeleteStep } = JSON.parse(jsonData.data);
                  if (runningStep) {
                    aiMessageReceived.runningSteps.push(runningStep);
                  }
                  if (compeleteStep) {
                    aiMessageReceived.runningSteps = aiMessageReceived.runningSteps.filter((step) => step !== compeleteStep);
                    aiMessageReceived.compeleteSteps.push(compeleteStep);
                  }
                } else {
                  if (aiMessageReceived[jsonData.type] === undefined) {
                    aiMessageReceived[jsonData.type] = '';
                  }
                  // systemDescription navigation
                  aiMessageReceived[jsonData.type] += jsonData.data;
                }
              }

              const { systemDescription, pages } = aiMessageReceived;
              lastAIMessage.content = `${systemDescription || ''}\n${Object.values(pages).map((page) => page.pageDescription || '').join('\n')}`;
              lastAIMessage.artifact = aiMessageReceived;
            }
            return { messages: updatedMessages };
          });
        }

        boundary = buffer.indexOf('\n\n');
      }

      set((state) => {
        const updatedMessages = [...state.messages];
        const lastAIMessage = updatedMessages.findLast((content) => content.role === 'ai');
        if (lastAIMessage) {
          lastAIMessage.isLoading = false;
        }
        return { messages: updatedMessages };
      });
    }
  },
  getLastAIMessage: () => {
    const messages = get().messages;
    return messages.slice().reverse().find((message) => message.role === 'ai');
  },
}));

export default useChatStore;

