import { jsonrepair } from 'jsonrepair';

export function llmJsonParse(input: string): any {

  try {
    // 预处理 input
    const preprocessedInput = input
      .replace(/```json/g, '') // 去除 ```json 标记
      .replace(/```/g, '') // 去除 ``` 标记
      .replace(/\n/g, '') // 去除不合理的换行符
      .replace(/\\/g, '\\'); // 处理转义符号

    const repairedJson = jsonrepair(preprocessedInput);
    return JSON.parse(repairedJson);
  } catch (error) {
    // console.error('Failed to parse JSON:', error);
    return null;
  }
}