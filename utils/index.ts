import { IWeight, IWeightTreeNode } from '@/types';
import { jsonrepair } from 'jsonrepair';

export function llmJsonParse(input: string): any {
  try {
    // 尝试在文本中寻找 JSON 内容
    let jsonContent = input;
    
    // 1. 首先尝试提取 ```json 或 ``` 包裹的内容
    const jsonMatch = input.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    } else {
      // 2. 如果没有完整的标记，尝试处理不完整的情况
      if (input.includes('```json')) {
        jsonContent = input.split('```json')[1].trim();
      } else if (input.includes('```')) {
        jsonContent = input.split('```')[1].trim();
      }
    }

    // 预处理提取的内容
    const preprocessedInput = jsonContent
      .replace(/```/g, '') // 清理可能残留的 ``` 标记
      .replace(/\\/g, '\\') // 处理转义符号
      .trim();

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

export const transformWeightsMapToTree = (weights: Record<string, IWeight>) => {
  const maps: Record<string, IWeightTreeNode> = {};

  Object.keys(weights).forEach(key => {
    maps[key] = {
      ...weights[key],
      name: key,
    }
  });

  Object.keys(maps).forEach(key => {
    const weight = maps[key];
    if (weight.parentId) {
      if (!Array.isArray(maps[weight.parentId].children)) {
        maps[weight.parentId].children = [];
      }
      maps[weight.parentId].children?.push(weight);
    }
  });

  return Object.values(maps).find(weight => !weight.parentId);
}