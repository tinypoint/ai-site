import { ChatOpenAI, ChatOpenAIFields } from "@langchain/openai";
import { ChatOllama, ChatOllamaInput } from "@langchain/ollama";

const CHAT = 'deepseek-chat'
const REASONER = 'deepseek-reasoner'
const useOllama = true;

class ChatDeepSeekAPI extends ChatOpenAI {
  constructor(fields: ChatOpenAIFields) {
    const { configuration, model, ...rest } = fields || {};
    super({
      apiKey: process.env.OPENAI_API_KEY,
      model: model || CHAT,
      ...rest,
      configuration: {
        ...(configuration || {}),
        basePath: 'https://api.deepseek.com/v1',
      }
    });
  }
}

class ChatDeepSeekOllama extends ChatOllama {
  constructor(fields?: ChatOllamaInput) {
    super({
      model: fields?.model || "deepseek-r1:8b",
      ...(fields || {}),
    });
  }
}

export const Chat = useOllama ? ChatDeepSeekOllama : ChatDeepSeekAPI;
