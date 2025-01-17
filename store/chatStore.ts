import { create } from 'zustand';

interface SystemMessage {
  role: 'system';
  content: string;
}
interface UserMessage {
  role: 'user';
  content: string;
}

interface AIMessage {
  role: 'ai';
  content: string;
  artifact?: {
    schemaTypes?: string;
    querys?: string;
    schemaProps?: string;
    schemaLayouts?: string;
    finalSchema?: string;
  };
  progress?: {
    runningSteps: string[];
    compeleteSteps: string[];
  };
}

type Message = SystemMessage | UserMessage | AIMessage;

interface ChatState {
  messages: Message[];
  inputValue: string;
  setMessages: (messages: Message[]) => void;
  setInputValue: (value: string) => void;
  updateLastMessage: (text: string) => void;
  parseStreamResponse: (reader: ReadableStreamDefaultReader<Uint8Array>) => void;
  getLastAIMessage: () => AIMessage | undefined;
}

const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  inputValue: '学生列表查询页',
  setMessages: (messages: Message[]) => set(() => ({ messages })),
  setInputValue: (value: string) => set(() => ({ inputValue: value })),
  updateLastMessage: (text: string) => set((state) => {
    const updatedMessages = [...state.messages];
    if (updatedMessages.length > 0) {
      updatedMessages[updatedMessages.length - 1].content = text;
    }
    return { messages: updatedMessages };
  }),
  parseStreamResponse: async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const decoder = new TextDecoder();
    let buffer = '';
    let aiMessageReceived: Record<string, string> = {};

    const progress: { runningSteps: string[]; compeleteSteps: string[] } = {
      runningSteps: [],
      compeleteSteps: []
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf('\n\n');
      while (boundary !== -1) {
        const chunk = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);

        if (chunk.startsWith('data: ')) {
          const jsonData = JSON.parse(chunk.slice(6));
          set((state) => {
            const updatedMessages = [...state.messages];
            const lastAIMessage = updatedMessages.findLast((message) => message.role === 'ai');
            if (lastAIMessage) {

              if (jsonData.type === 'progress') {
                const { runningStep, compeleteStep } = JSON.parse(jsonData.data);
                if (runningStep) {
                  progress.runningSteps.push(runningStep);
                }
                if (compeleteStep) {
                  progress.runningSteps = progress.runningSteps.filter((step) => step !== compeleteStep);
                  progress.compeleteSteps.push(compeleteStep);
                }
              } else {
                if (aiMessageReceived[jsonData.type] === undefined) {
                  aiMessageReceived[jsonData.type] = '';
                }
                aiMessageReceived[jsonData.type] += jsonData.data;
              }

              const { plan, ...rest } = aiMessageReceived;
              lastAIMessage.content = plan;
              lastAIMessage.artifact = rest;
              lastAIMessage.progress = { ...progress };
            }
            return { messages: updatedMessages };
          });
        }

        boundary = buffer.indexOf('\n\n');
      }
    }
  },
  getLastAIMessage: () => {
    const messages = get().messages;
    return messages.slice().reverse().find((message) => message.role === 'ai');
  },
}));

export default useChatStore;

export type { UserMessage, AIMessage, Message }; 