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

export const mergeObjects = (target: any, source: any) => {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) {
        target[key] = {};
      }
      mergeObjects(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
};