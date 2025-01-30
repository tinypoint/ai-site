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

interface ITableColumnActions extends ITableColumnBase {
  title: string;
  dataIndex: 'ai-site-actions'; // 固定值，用于标识 actions 列
  key: 'ai-site-actions'; // 固定值，用于标识 actions 列
  renderType: 'actions'; // 根据表格中 TableActionButton，决定是否生成生成 actions 列，一个表格最多只能有一个 actions 列，必须放在表格的最后一列
}

interface ITableProps {
  columns: <ITableColumnText | ITableColumnTag | ITableColumnActions>[];
}

interface IButtonProps {
  text: string;
  variant?: "default" | "destructive" | "outline" | "ghost" | "link";
  disabled?: boolean;
}

interface ITableActionButtonProps {
  text: string;
  variant?: "default" | "destructive" | "outline" | "ghost" | "link";
  disabled?: boolean;
}

interface IFormInputProps {
  label: string;
  fieldName: string;
  placeholder: string;
  disabled?: boolean;
}

interface IInputProps {
  label: string;
  placeholder: string;
  disabled?: boolean;
}

interface ITextProps {
  content: string;
}

interface IFormSelectProps {
  label: string;
  fieldName: string;
  placeholder: string;
  options: { label: string; value: string }[];
  disabled?: boolean;
}

interface ISelectProps {
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
  disabled?: boolean;
}

interface IFormRadioListProps {
  label: string;
  fieldName: string;
  options: { label: string; value: string }[];
  disabled?: boolean;
}

interface ICheckboxProps {
  label: string;
  disabled?: boolean;
}

interface IFormCheckboxProps {
  label: string;
  fieldName: string;
  disabled?: boolean;
}

interface IRadioListProps {
  label: string;
  options: { label: string; value: string }[];
  disabled?: boolean;
}

interface IFormSwitchProps {
  label: string;
  fieldName: string;
  disabled?: boolean;
}

interface ISwitchProps {
  label: string;
  disabled?: boolean;
}

interface IFormSliderProps {
  label: string;
  fieldName: string;
  disabled?: boolean;
}

interface ISliderProps {
  label: string;
  disabled?: boolean;
}

interface IFormDatePickerProps {
  label: string;
  fieldName: string;
  disabled?: boolean;
  type: 'date' | 'datetime' | 'time' | 'date-range' | 'datetime-range' | 'time-range';
}

interface IDatePickerProps {
  label: string;
  disabled?: boolean;
  type: 'date' | 'datetime' | 'time' | 'date-range' | 'datetime-range' | 'time-range';
}

type WeightName = string; // 组件的唯一标识，格式为：英文组件类型加数字

type IWeightProps = IPageProps | IContainerProps | IFormProps | IModalProps | ITableProps
    | IInputProps | IButtonProps | ITableActionButtonProps | ISelectProps | ICheckboxProps | IRadioListProps | ISwitchProps
    | ISliderProps | IDatePickerProps | IFormInputProps | IFormSelectProps | IFormRadioListProps | IFormCheckboxProps
    | IFormSwitchProps | IFormSliderProps | IFormDatePickerProps | ITextProps;

type IWeight = {
  props: IWeightProps
};

type IOutput = Record<WeightName, IWeight>;
\`\`\`
</outputDefinition>

<example>
\`\`\`json
{
  "Container1":{"props":{}},
  "Button1":{"props":{"text":"按钮"}}
}
\`\`\`
</example>

<output>
1. 输出合法的 json，不允许包含解释
2. 输出需要符合上方IOutput的类型定义
3. 使用\`\`\`json和\`\`\`包裹输出，最小化缩进和换行
</output>
`