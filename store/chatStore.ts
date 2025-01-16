import { create } from 'zustand';

interface AIMessage {
  type: 'ai';
  text: string;
  progress?: {
    runningStep: string;
    doneSteps: string[];
  };
}

interface UserMessage {
  type: 'user';
  text: string;
}

type Message = AIMessage | UserMessage;

interface ChatState {
  messages: Message[];
  inputValue: string;
  setMessages: (messages: Message[]) => void;
  setInputValue: (value: string) => void;
  updateLastMessage: (text: string) => void;
  parseStreamResponse: (reader: ReadableStreamDefaultReader<Uint8Array>) => void;
}

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  inputValue: '',
  setMessages: (messages: Message[]) => set(() => ({ messages })),
  setInputValue: (value: string) => set(() => ({ inputValue: value })),
  updateLastMessage: (text: string) => set((state) => {
    const updatedMessages = [...state.messages];
    if (updatedMessages.length > 0) {
      updatedMessages[updatedMessages.length - 1].text = text;
    }
    return { messages: updatedMessages };
  }),
  parseStreamResponse: async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const decoder = new TextDecoder();
    let buffer = '';

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
            const lastAIMessage = updatedMessages.findLast((message) => message.type === 'ai');
            if (lastAIMessage) {
              if (jsonData.type === 'schemaNames' || jsonData.type === 'schemaProps' || jsonData.type === 'schemaLayouts') {
                // lastAIMessage.text += jsonData.data;
              } else if (jsonData.type === 'progress') {
                const { runningStep, doneSteps } = JSON.parse(jsonData.data);
                lastAIMessage.progress = {
                  runningStep,
                  doneSteps,
                };
              }
            }
            return { messages: updatedMessages };
          });
        }

        boundary = buffer.indexOf('\n\n');
      }
    }
  },
}));

export default useChatStore; 