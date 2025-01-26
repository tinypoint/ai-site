import { knowledge } from "./knowledge";

export const schemaEventsPrompt = `${knowledge}

<task>
1. 深入理解用户的真实需求
2. 根据站点总体规划和当前的页面组件和页面请求接口，为页面中所有组件生成合理的事件，事件触发实际，和触发动作
</task>

<outputDefinition>
\`\`\`typescript

// 开始节点,只能有一个
interface IStartActionNode {
  id: 'start';
  type: 'start';
  outputHandle: ['next']; // 输出端点名称列表
}

interface IExecuteQueryActionNode {
  id: string; // 动作节点的唯一标识，格式为：英文动作类型加数字，比如 startQuery1, startQuery2
  type: 'executeQuery';
  options: {
    queryName: string; // 查询的唯一标识，格式为：英文查询类型加数组
  };
  inputHandle: ['trigger']; // 输入端点名称
  outputHandle: ['success', 'error', 'next']; // 输出端点名称列表
}

interface ISetComponentPropsActionNode {
  id: string; // 动作节点的唯一标识，格式为：英文动作类型加数字，比如 setComponentProps1, setComponentProps2
  type: 'setComponentProps';
  options: {
    weightName: string; // 组件的唯一标识，格式为：英文组件类型加数组
    props: Record<string, any>; // 组件的 props
  };
  inputHandle: ['trigger']; // 输入端点名称
  outputHandle: ['next']; // 输出端点名称列表
}

interface IControlComponentActionNode {
  id: string; // 动作节点的唯一标识，格式为：英文动作类型加数字，比如 controlComponent1, controlComponent2
  type: 'controlComponent';
  options: {
    weightName: string; // 组件的唯一标识，格式为：英文组件类型加数组
    method: string; // Modal 组件的 method 有 'open' | 'close',  Form 组件的 method 有 'submit' | 'reset'
  };
  inputHandle: ['trigger']; // 输入端点名称
  outputHandle: ['next']; // 输出端点名称列表
}

interface IToastActionNode {
  id: string; // 动作节点的唯一标识，格式为：英文动作类型加数字，比如 toast1, toast2
  type: 'toast';
  options: {
    message: string;
    duration: number; // 0 表示不自动关闭，单位为毫秒，1000 表示 1 秒后自动关闭
  };
  inputHandle: ['trigger']; // 输入端点名称
  outputHandle: ['next']; // 输出端点名称列表
}

type IActionNode = IStartActionNode | IExecuteQueryActionNode | ISetComponentPropsActionNode | IControlComponentActionNode | IToastActionNode;

interface IActionEdge {
  source: {
    id: string;
    outputHandle: string; // 输出端点名称
  };
  target: {
    id: string;
    inputHandle: string; // 输入端点名称
  };
}

interface IWeightEventFlow = {
  nodes: IActionNode[];
  edges: IActionEdge[];
};

interface IPageEvents {
  onPageLoad: IWeightEventFlow;
}

interface IContainerEvents {}

interface IFormEvents {
  onSubmit: IWeightEventFlow;
}

interface IModalEvents {
  onClose: IWeightEventFlow;
}

interface ITableEvents {
  onRowClick: IWeightEventFlow;
}

interface IButtonEvents {
  onClick: IWeightEventFlow;
}

interface ITableActionButtonEvents {
  onClick: IWeightEventFlow;
}

interface IFormInputEvents {
}

interface IInputEvents {
  onChange: IWeightEventFlow;
}

interface IFormSelectEvents {
}

interface ISelectEvents {
  onChange: IWeightEventFlow;
}

interface IFormCheckboxEvents {
}

interface ICheckboxEvents {
  onChange: IWeightEventFlow;
}

interface IFormRadioListEvents {
}

interface IRadioListEvents {
  onChange: IWeightEventFlow;
}

interface IFormSwitchEvents {
}

interface ISwitchEvents {
  onChange: IWeightEventFlow;
}

interface IFormSliderEvents {
}

interface ISliderEvents {
  onChange: IWeightEventFlow;
}

interface IFormDatePickerEvents {
}

interface IDatePickerEvents {
  onChange: IWeightEventFlow;
}

interface IFormTextAreaEvents {
}

interface ITextAreaEvents {
  onChange: IWeightEventFlow;
}

type WeightName = string; // 组件的唯一标识，格式为：英文组件类型加数组

type IWeightEvents = IPageEvents | IContainerEvents | IFormEvents | IModalEvents | ITableEvents
    | IInputEvents | IButtonEvents | ITableActionButtonEvents | ISelectEvents | ICheckboxEvents | IRadioListEvents | ISwitchEvents
    | ISliderEvents | IDatePickerEvents | ITextAreaEvents | IFormInputEvents | IFormSelectEvents | IFormCheckboxEvents | IFormRadioListEvents | IFormSwitchEvents | IFormSliderEvents | IFormDatePickerEvents;

type IOutput = Record<WeightName, IWeightEvents>;
\`\`\`
</outputDefinition>

<example>
\`\`\`json
{
  "button1": {"onClick":{"nodes":[{"id":"start","type":"start","outputHandle":["next"]},{"id":"controlComponent1","type":"controlComponent","options":{"weightName":"modal1","method":"open"},"inputHandle":["trigger"],"outputHandle":["next"]},{"id":"toast1","type":"toast","options":{"message":"按钮打开 Modal 成功","duration":1000},"inputHandle":["trigger"],"outputHandle":["next"]}],"edges":[{"source":{"id":"start","outputHandle":"next"},"target":{"id":"controlComponent1","inputHandle":"trigger"}},{"source":{"id":"controlComponent1","outputHandle":"next"},"target":{"id":"toast1","inputHandle":"trigger"}}]}},
  "modal1": {"onClose":{"nodes":[{"id":"start","type":"start","outputHandle":["next"]},{"id":"toast1","type":"toast","options":{"message":"点击了取消","duration":1000},"inputHandle":["trigger"],"outputHandle":["next"]},{"id":"controlComponent1","type":"controlComponent","options":{"weightName":"modal1","method":"close"},"inputHandle":["trigger"],"outputHandle":["next"]}],"edges":[{"source":{"id":"start","outputHandle":"next"},"target":{"id":"controlComponent1","inputHandle":"trigger"}},{"source":{"id":"controlComponent1","outputHandle":"next"},"target":{"id":"toast1","inputHandle":"trigger"}}]}}
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