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
    schemaNames?: string;
    schemaProps?: string;
    schemaLayouts?: string;
    finalSchema?: string;
  };
  progress?: {
    runningStep: string;
    doneSteps: string[];
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
  inputValue: '登录页',
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
    let aiMessageReceived: { progress?: { runningStep: string; doneSteps: string[] } } & Record<string, string> = {};

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
                const { runningStep, doneSteps } = JSON.parse(jsonData.data);
                aiMessageReceived.progress = {
                  runningStep, doneSteps
                };
              } else {
                if (aiMessageReceived[jsonData.type] === undefined) {
                  aiMessageReceived[jsonData.type] = '';
                }
                aiMessageReceived[jsonData.type] += jsonData.data;
              }

              const { progress, plan, ...rest } = aiMessageReceived;
              lastAIMessage.content = plan;
              lastAIMessage.artifact = rest;
              lastAIMessage.progress = progress;
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