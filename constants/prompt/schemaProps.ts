import { knowledge } from "./knowledge";

export const schemaPropsPrompt = `${knowledge}

<task>
1. 深入理解用户的真实需求
2. 为 schema 生成组件的 props
</task>

<outputDefinition>
\`\`\`typescript

interface IPageProps {}

interface IContainerProps {}

interface IFormProps { 
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
}

interface IFormInputProps {
  label: string;
  fieldName: string;
  placeholder: string;
}

interface IInputProps {
  label: string;
  placeholder: string;
}

interface ITextProps {
  content: string;
}

interface IFormSelectProps {
  label: string;
  fieldName: string;
  placeholder: string;
  options: { label: string; value: string }[];
}

interface ISelectProps {
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
}

interface IFormRadioListProps {
  label: string;
  fieldName: string;
  options: { label: string; value: string }[];
}

interface ICheckboxProps {
  label: string;
}

interface IFormCheckboxProps {
  label: string;
  fieldName: string;
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
  type: 'date' | 'datetime' | 'time' | 'date-range' | 'datetime-range' | 'time-range';
}

interface IDatePickerProps {
  label: string;
  type: 'date' | 'datetime' | 'time' | 'date-range' | 'datetime-range' | 'time-range';
}

type WeightName = string; // 组件的唯一标识，格式为：英文组件类型加数组

type IWeightProps = IPageProps | IContainerProps | IFormProps | IModalProps | ITableProps
    | IInputProps | IButtonProps | ISelectProps | ICheckboxProps | IRadioListProps | ISwitchProps
    | ISliderProps | IDatePickerProps | IFormInputProps | IFormSelectProps | IFormRadioListProps | IFormCheckboxProps
    | IFormSwitchProps | IFormSliderProps | IFormDatePickerProps | ITextProps;

type IWeight = {
  props: IWeightProps
};

type IOutput = Record<WeightName, IWeight>;
\`\`\`
</outputDefinition>

<output>
1. 输出合法的 json，不允许包含解释
2. 输出需要符合上方IOutput的类型定义
3. 输出以\`\`\`json开头，以\`\`\`结尾
</output>
`