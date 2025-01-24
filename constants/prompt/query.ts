import { knowledge } from "./knowledge";

export const queryPrompt = `${knowledge}

<task>
1. 深入理解用户的真实需求
2. 根据用户的需求，生成页面需要请求的接口
3. 请求要合理，不要出现不合理的请求
</task>

<example>
\`\`\`json
{
  "queryName1": {
    "url": "https://api.example.com/data",
    "method": "GET",
    "params": {
      "page": 1,
      "pageSize": 10
    },
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "queryName2": {
    "url": "https://api.example.com/data",
    "method": "POST",
    "body": {
      "name": "test",
      "age": 18
    },
    "headers": {
      "Content-Type": "application/json"
    }
  }
}
\`\`\`
</example>

<outputDefinition>
\`\`\`typescript

type IQueryName = string;

type IQuery = {
  url: string;
  method: string;
  headers?: Record<string, string>;
  params?: Record<string, string>; // url参数
  body?: Record<string, string>; // 请求体
  cookies?: Record<string, string>;
};

type IOutput = Record<IQueryName, IQuery>
\`\`\`
</outputDefinition>

<output>
1. 输出合法的 json，不允许包含解释
2. 输出需要符合上方IOutput的类型定义
3. 输出以\`\`\`json开头，以\`\`\`结尾
</output>
`;

export const queryMockResponsePrompt = `${knowledge}

<task>
1. 进行步骤六：为所有接口请求生成合理的 mock 数据
2. 深入理解用户的真实需求
3. 根据用户的需求，为页面中的请求接口生成mock的响应
4. mock数据要真实合理
5. mock数据要充分考虑页面中的组件和页面中的请求
</task>

<example>
\`\`\`json
{
  "queryName1": {
    "response": {
      "statusCode": 0,
      "data": {
        "taskList": [
          {
            "taskId": "1",
            "taskName": "test",
            "taskStatus": "1"
          },
          {
            "taskId": "2",
            "taskName": "test2",
            "taskStatus": "2"
          }
        ]
      }
    }
  },
  "queryName2": {
    "response": {
      "status_code": 0,
      "msg": "删除成功"
    }
  },
  "queryName3": {
    "response": {
      "code": 200,
      "bookDetail": {
        "bookId": "1",
        "bookName": "test",
        "bookPrice": 18
      }
    }
  }
}
\`\`\`
</example>

<outputDefinition>
\`\`\`typescript

type IQueryName = string;

type IQueryMockResponse = {
  response: any;
};

type IOutput = Record<IQueryName, IQueryMockResponse>
\`\`\`
</outputDefinition>

<output>
1. 输出合法的 json，不允许包含解释
2. 输出需要符合上方IOutput的类型定义
3. 输出以\`\`\`json开头，以\`\`\`结尾
</output>
`;
