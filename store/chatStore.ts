import { create } from 'zustand';

interface Message {
  type: 'user' | 'ai';
  text: string;
}

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
            if (updatedMessages.length > 0) {
              updatedMessages[updatedMessages.length - 1].text += jsonData.data;
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