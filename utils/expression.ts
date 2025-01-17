export const evaluateExpression = (expression: string, context: any): any => {
  try {
    // 使用 Function 构造函数创建一个新的函数
    const func = new Function(...Object.keys(context), `return ${expression};`);
    // 调用函数并传入上下文中的值
    return func(...Object.values(context));
  } catch (error) {
    // console.log('Error evaluating expression:', error);
    return null;
  }
};

export const parseObjectExpressions = (obj: Record<string, any>, context: any): Record<string, any> => {
  const result: Record<string, any> = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // 使用正则表达式替换模板语法
      const value = obj[key].trim()
      if (value.startsWith('{{') && value.endsWith('}}')) {
        result[key] = evaluateExpression(value.slice(2, -2), context)
      } else {
        result[key] = value.replace(/{{\s*([^}]+)\s*}}/g, (_, expr) => {
          const value = evaluateExpression(expr.trim(), context);
          return value !== null && value !== undefined ? value : '';
        }) || undefined;
      }
    } else {
      result[key] = obj[key];
    }
  }
  return result;
};
