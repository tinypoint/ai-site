import { ChatOpenAI, ChatOpenAIFields } from "@langchain/openai";

const useSiliconFlow = true;

class ChatDeepSeekAPI extends ChatOpenAI {
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

class ChatSiliconFlow extends ChatOpenAI {
  constructor(fields: ChatOpenAIFields) {
    const { configuration, model, ...rest } = fields || {};
    super({
      apiKey: process.env.SILICONFLOW_API_KEY,
      model: model || 'deepseek-ai/DeepSeek-V3',
      ...rest,
      configuration: {
        ...(configuration || {}),
        basePath: 'https://api.siliconflow.cn/v1',
      }
    });
  }
}


export const Chat = useSiliconFlow ? ChatSiliconFlow : ChatDeepSeekAPI;
