import { ChatOpenAI, ChatOpenAIFields } from "@langchain/openai";

export class ChatDeepSeek extends ChatOpenAI {
  constructor(fields: ChatOpenAIFields) {
    const { configuration, model, ...rest } = fields || {};
    super({
      apiKey: process.env.OPENAI_API_KEY,
      model: model || 'deepseek-chat',
      ...rest,
      configuration: {
        ...(configuration || {}),
        basePath: 'https://api.deepseek.com/v1',
      }
    });
  }
}
