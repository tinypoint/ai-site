import { knowledge, WeightType } from "./knowledge";

export const schemaLayoutPrompt = `${knowledge}

<task>
1. 深入理解用户的真实需求
2. 深入理解页面规划中布局的相关信息
3. 为页面生成组件，指定组件类型和父级
4. 为每个组件设置合理美观的 layout 和 style
5. 每类组件可以使用的 style 属性有差别，请严格按照下方定义来生成组件 style
</task>

<outputDefinition>
\`\`\`typescript

type GridUnit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;
type ColumnSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;
type Pixel8Multiplier = number & { __brand: '8px-multiplier' }; // 品牌类型确保只接受8的倍数

type WeightName = string; // 组件的唯一标识，格式为：英文组件类型加数组

type ContainerLayout = {
  x: GridUnit;
  width: ColumnSpan;
  heightMode: 'fixed' | 'auto';
  y: Pixel8Multiplier;
  height: Pixel8Multiplier;
  marginX: Pixel8Multiplier;
  marginY: Pixel8Multiplier;
  paddingX: Pixel8Multiplier;
  paddingY: Pixel8Multiplier;
};

type ItemLayout = {
  x: GridUnit; 
  width: ColumnSpan;
  y: Pixel8Multiplier; 
  height: Pixel8Multiplier; 
}

type ITableActionButtonLayout = {} // 表格操作列中的按钮的布局类型，不需要设置任何布局

// 容器组件的布局类型是 ContainerLayout

// 除了 TableActionButton 组件的布局类型是 TableActionButtonLayout，其他的非容器组件的布局类型都是 ItemLayout

type IWeightLayout = IContainerLayout | IFormLayout | ITableActionButtonLayout;

type IPageStyle = {
  backgroundColor: string;
}

type IContainerStyle = {
  backgroundColor: string;
  borderRadius: string;
  border: string;
}

type IFormStyle = {
  backgroundColor: string;
  borderRadius: string;
  border: string;
}

type IModalStyle = {}

type ITableStyle = {
  border: string;
  borderRadius: string;
  backgroundColor: string;
}

type ITextStyle = {
  fontSize: string;
  fontWeight: string;
  color: string;
}

type IButtonStyle = {}

type IFormInputStyle = {}
type IInputStyle = {

type IFormSelectStyle = {}
type ISelectStyle = {}

type IFormCheckboxStyle = {}
type ICheckboxStyle = {}

type IFormRadioListStyle = {}
type IRadioListStyle = {}

type IFormSwitchStyle = {}
type ISwitchStyle = {}

type IFormSliderStyle = {}
type ISliderStyle = {}

type IFormDatePickerStyle = {}
type IDatePickerStyle = {}

type IFormTextAreaStyle = {}
type ITextAreaStyle = {}
type ITableActionButtonStyle = {}

type IWeightStyle = IPageStyle | IContainerStyle | ITextStyle | IFormStyle | IModalStyle | ITableStyle
    | IButtonStyle | IInputStyle | ISelectStyle | ICheckboxStyle | IRadioListStyle | ISwitchStyle
    | ISliderStyle | IDatePickerStyle | ITextAreaStyle | IFormInputStyle | IFormSelectStyle | IFormCheckboxStyle | IFormRadioListStyle | IFormSwitchStyle | IFormSliderStyle | IFormDatePickerStyle | IFormTextAreaStyle | ITableActionButtonStyle;

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

type IWeightProps = IPageProps | IContainerProps | IFormProps | IModalProps | ITableProps
    | IInputProps | IButtonProps | ITableActionButtonProps | ISelectProps | ICheckboxProps | IRadioListProps | ISwitchProps
    | ISliderProps | IDatePickerProps | IFormInputProps | IFormSelectProps | IFormRadioListProps | IFormCheckboxProps
    | IFormSwitchProps | IFormSliderProps | IFormDatePickerProps | ITextProps;

${WeightType}

type IWeight = {
  type: IWeightType;
  parent: WeightName | null;
  layout: IWeightLayout;
  style: IWeightStyle;
  props: IWeightProps;
};

type IOutput = Record<WeightName, IWeight>;
\`\`\`
</outputDefinition>

<example>
\`\`\`json
{
  "Container1":{"type":"Container","parent":"Page1","layout":{"x":0,"width":24,"heightMode":"auto","y":0,"height":16,"marginX":1,"marginY":1,"paddingX":1,"paddingY":1},"style":{"backgroundColor":"#000","borderRadius":"0","border":"0"}},
  "Button1":{"type":"Button","parent":"Container1","layout":{"x":0,"width":2,"y":0,"height":5},"style":{}}
}
\`\`\`
</example>

<output>
1. 输出合法的 json，不允许包含解释
2. 输出需要符合上方IOutput的类型定义
3. 使用\`\`\`json和\`\`\`包裹输出，最小化缩进和换行
</output>
`