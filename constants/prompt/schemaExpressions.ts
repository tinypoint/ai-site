import { knowledge } from "./knowledge";

export const schemaExpressionsPrompt = `${knowledge}

<task>
1. 深入理解用户真实需求，明确数据流向应为【组件 -> 请求参数】和【请求响应 -> 组件属性】
2. 严格遵循单向数据流原则生成表达式：
   - 组件的属性值只能来自：常量、其他组件状态、请求响应数据
   - 请求的参数值只能来自：常量、组件状态、其他请求响应数据
3. 根据站点规划，为每个组件属性和请求参数生成合法表达式
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
<importantRules>
1. 严格禁止循环依赖（如 Input1.value 不能绑定到 Query1.params.id，同时 Query1.response 又绑定到 Input1.value） 
2. 组件属性值来源优先级：请求响应 > 其他组件状态 > 常量
3. 请求参数值来源优先级：组件状态 > 其他请求响应 > 常量
</importantRules>

<example>
\`\`\`json
{
  "weights": {
    "Table1":{"dataSource":"{{ GetStudents.response.list }}","loading":"{{ GetStudents.loading }}"},
  },
  "querys": {
    "GetStudents": {"params":{"keyword":"{{ SearchInput1.value }}","page":"{{ Table1.currentPage }}"}},
    "SubmitForm": {"body":{"name":"{{ FormInput1.value }}","age":"{{ FormNumberInput1.value }}"}}
  }
}
\`\`\`
</example>

<output>
 1. 输出严格符合单向数据流原则的合法JSON
 2. 确保无循环依赖和反向绑定
 3. 组件属性只能依赖：请求响应、其他组件状态、常量
 4. 请求参数只能依赖：组件状态、其他请求响应、常量
 5. 使用\`\`\`json和\`\`\`包裹输出，最小化缩进和换行
 </output>
`