import { knowledge } from "./knowledge";

export const schemaPropsPrompt = `${knowledge}

<role>
你是一个专业的低代码开发者，你擅长理解用的真实需求，为的schema生成组件的props
</role>

<task>
1. 深入理解用户的真实需求
2. 为 schema 生成组件的 props
</task>

<outputDefinition>
\`\`\`typescript

interface IPageProps {}

interface IContainerProps {}

interface IFormProps {
  labelCol: { span: number; } span 从 0 到 24,  labelCol.span + wrapperCol.span = 24
  wrapperCol: { span: number; } span 从 0 到 24,  labelCol.span + wrapperCol.span = 24
}

interface IModalProps {
  title: string;
}

interface ITableColumnBase {
  title: string;
  dataIndex: string;
  key: string;
}

interface ITableColumnText extends ITableColumnBase {
  renderType: 'text';
}

interface ITableColumnTag extends ITableColumnBase {
  renderType: 'tag';
  colorsMap: Record<string, "success" | "warning" | "danger" | "info" | "secondary" | "contrast">;
}

interface ITableProps {
  columns: <ITableColumnText | ITableColumnTag>[];
}

interface IButtonProps {
  text: string;
  htmlType?: 'submit' | 'reset' | 'button';
}

interface IFormInputProps {
  label: string;
  fieldName: string;
}

interface IInputProps {
  label: string;
}

interface IFormSelectProps {
  label: string;
  fieldName: string;
  options: { label: string; value: string }[];
}

interface ISelectProps {
  label: string;
  options: { label: string; value: string }[];
}

interface IFormRadioListProps {
  label: string;
  fieldName: string;
  options: { label: string; value: string }[];
}

interface ICheckboxListProps {
  label: string;
  options: { label: string; value: string }[];
}

interface IFormCheckboxListProps {
  label: string;
  fieldName: string;
  options: { label: string; value: string }[];
}

interface IRadioListProps {
  label: string;
  options: { label: string; value: string }[];
}

interface IFormSwitchProps {
  label: string;
  fieldName: string;
}

interface ISwitchProps {
  label: string;
}

interface IFormSliderProps {
  label: string;
  fieldName: string;
}

interface ISliderProps {
  label: string;
}

interface IFormDatePickerProps {
  label: string;
  fieldName: string;
}

interface IDatePickerProps {
  label: string;
  type: 'date' | 'datetime' | 'time' | 'date-range' | 'datetime-range' | 'time-range';
}

type WeightName = string; // 组件的唯一标识，格式为：英文组件类型加数组

type IWeightProps = IPageProps | IContainerProps | IFormProps | IModalProps | ITableProps
    | IInputProps | IButtonProps | ISelectProps | ICheckboxListProps | IRadioListProps | ISwitchProps
    | ISliderProps | IDatePickerProps | IFormInputProps | IFormSelectProps | IFormRadioListProps | IFormCheckboxListProps
    | IFormSwitchProps | IFormSliderProps | IFormDatePickerProps;

type IWeight = {
  props: IWeightProps
};

type IOutput = Record<WeightName, IWeight>;
\`\`\`
</outputDefinition>

<output>
1. 输出合法的 json，不允许包含解释
2. 输出需要符合上方IOutput的类型定义
3. 输出以\`\`\`json开头，以\`\`\`json结尾
</output>
`