import { ChatOpenAI, ChatOpenAIFields } from "@langchain/openai";

const CHAT = 'deepseek-chat'
const REASONER = 'deepseek-reasoner'

export class ChatDeepSeek extends ChatOpenAI {
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
