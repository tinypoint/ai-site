import { knowledge } from "./knowledge";

export const schemaExpressionsPrompt = `${knowledge}

<task>
1. 深入理解用户的真实需求
2. 根据站点规划，为页面中每个组件的属性和页面中每个请求的 url，请求参数，请求体，请求头，请求 cookie 生成合理的表达式
</task>

<outputDefinition>
\`\`\`typescript


type IWeightName = string; // 组件的唯一标识，格式为：英文组件类型加数组
type IQueryName = string; // 查询的唯一标识，格式为：英文组件类型加数组

type IExpression = string; // 语法是 双花括号包裹的javascript表达式，例如 {{ Input1.value }} {{ Query1.data.list }}

type IWeightExpression = Record<string, IExpression>;

type IQueryExpression = {
  url?: IExpression;
  params?: Record<string, IExpression>;
  body?: Record<string, IExpression>;
  headers?: Record<string, IExpression>;
  cookies?: Record<string, IExpression>;
};

type IOutput = {
  weights: Record<IWeightName, IWeightExpression>;
  querys: Record<IQueryName, IQueryExpression>;
};
\`\`\`
</outputDefinition>

<example>
\`\`\`json
{
  "weights": {
    "chart1": {
      "values": "{{ query2.response.chartDatas[0].value }}"
    },
    "table1": {
      "loading": "{{ Query3.loading }}",
      "dataSource": "{{ Query3.response.data.taskList }}"
    },
    "select3": {
      "options": "{{ Query4.response.statusList }}"
    }
  },
  "querys": {
    "Query1": {
      "params": {
        "bookId": "{{ BookIdInput1.value }}"
      }
    },
    "query2": {
      "body": {
        "bookId": "{{ BookIdInput5.value }}",
        "name": "{{ BookNameInput2.value }}",
        "author": "{{ BookAuthorSelect3.value }}"
      }
    },
    "Query3": {
      "url": "https://api.example.com/api/v1/car/{{ carIdInput1.value }}/delete",
      "headers": {
        "token": "{{ TokenInput1.value }}"
      }
    }
  }
}
\`\`\`
</example>

<output>
1. 输出合法的 json，不允许包含解释
2. 输出需要符合上方IOutput的类型定义
3. 输出以\`\`\`json开头，以\`\`\`结尾
4. 尽可能的减少 json 中的缩进和换行
</output>
`