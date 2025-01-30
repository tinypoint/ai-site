import { knowledge } from "./knowledge";

export const schemaLayoutPrompt = `${knowledge}

<task>
1. 深入理解用户的真实需求和页面规划中给出的布局建议
2. 输出json格式的组件映射表，为每个组件设置唯一ID，类型，父级，布局，属性
3. 确保组件布局符合AI SITE的布局规范
4. 组件布局属性中width是相对于父组件的宽度的24分栏，而不是相对于屏幕的宽度，这点要格外注意
</task>

<outputDefinition>
\`\`\`typescript

type GridUnit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;
type ColumnSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;
type Pixel8Multiplier = number & { __brand: '8px-multiplier' }; // 品牌类型确保只接受8的倍数

type WeightId = string; // 组件的唯一标识，格式为：英文组件类型加数字

// x + width <= 24

type IPageLayout = {
  x: 0;
  width: 24; // full width of screen
  heightMode: 'auto';
  y: 0;
  height: 135; // 1080px
}

type IContainerLayout = {
  x: GridUnit;
  width: ColumnSpan; // percent of "parent" width, not percent of screen width, 1 means 1 / 24 of "parent" width, 12 means half of "parent" width, 24 means full width of "parent"
  heightMode: 'auto' | 'fixed';
  y: Pixel8Multiplier;
  height: Pixel8Multiplier;
}

type IFormLayout = {
  x: GridUnit;
  width: ColumnSpan;
  heightMode: 'auto' | 'fixed';
  y: Pixel8Multiplier;
  height: Pixel8Multiplier;
}

// center of screen
type IModalLayout = {
  x: 6; // center of screen
  width: 12; // half of screen
  heightMode: 'auto' | 'fixed';
  y: 22; // 176px
  height: 60; // 480px
}

type ITableLayout = {
  x: GridUnit;
  width: ColumnSpan;
  heightMode: 'auto' | 'fixed';
  y: Pixel8Multiplier;
  height: Pixel8Multiplier; // default 50, 400px
}

type ITableActionButtonLayout = {} // don not need to set layout

type IInputLayout = {
  x: GridUnit;
  width: ColumnSpan;
  y: Pixel8Multiplier;
  height: Pixel8Multiplier; // default 5, 40px
}

type IFormInputLayout = IInputLayout;
type ISelectLayout = IInputLayout;
type IFormSelectLayout = IInputLayout;
type ICheckboxLayout = IInputLayout;
type IFormCheckboxLayout = IInputLayout;
type ISwitchLayout = IInputLayout;
type IFormSwitchLayout = IInputLayout;
type ISliderLayout = IInputLayout;
type IFormSliderLayout = IInputLayout;
type IDatePickerLayout = IInputLayout;
type IFormDatePickerLayout = IInputLayout;

type ITextAreaLayout = IInputLayout;
type IFormTextAreaLayout = IInputLayout;

// when option is horizontal
type IFormRadioListLayout = IInputLayout;
type IRadioListLayout = IInputLayout;

// when option is vertical, width is 4, height is 40
type IFormRadioListLayout = {
  x: GridUnit;
  width: ColumnSpan;
  y: Pixel8Multiplier;
  height: Pixel8Multiplier; // option count * 5, 1 option height is 5, 2 option height is 10, 3 option height is 15 and so on
};

type IRadioListLayout = {
  x: GridUnit;
  width: ColumnSpan;
  y: Pixel8Multiplier;
  height: Pixel8Multiplier; // option count * 5, 1 option height is 5, 2 option height is 10, 3 option height is 15 and so on
};

type IFormTextAreaLayout = {
  x: GridUnit;
  width: ColumnSpan;
  y: Pixel8Multiplier;
  height: Pixel8Multiplier; // rows * 5, 1 row height is 5, 2 row height is 10, 3 row height is 15 and so on
};

type ITextAreaLayout = {
  x: GridUnit;
  width: ColumnSpan;
  y: Pixel8Multiplier;
  height: Pixel8Multiplier; // rows * 5, 1 row height is 5, 2 row height is 10, 3 row height is 15 and so on
};

type IButtonLayout = {
  x: GridUnit;
  width: ColumnSpan;
  y: Pixel8Multiplier;
  height: Pixel8Multiplier; // default 5, 40px
};

interface IPageProps {
  backgroundColor: var(--canvas-bg-color);
}

interface IContainerProps {
  border?: boolean;
  radius?: "none" | "sm" | "md" | "lg";
  backgroundColor: var(--container-bg-color);
}

interface IFormProps {
  border?: boolean;
  radius?: "none" | "sm" | "md" | "lg";
  backgroundColor: var(--container-bg-color);
}

interface IModalProps {
  title: string;
  backgroundColor: var(--modal-bg-color);
}

interface ITableColumnText {
  title: string;
  dataIndex: string;
  renderType: 'text';
}

interface ITableColumnTag {
  title: string;
  dataIndex: string;
  renderType: 'tag';
  colorsMap: Record<string, "success" | "warning" | "danger" | "info" | "secondary" | "contrast">;
}

interface ITableColumnActions {
  title: string;
  dataIndex: 'ai-site-actions'; // 固定值，用于标识 actions 列
  renderType: 'actions'; // 根据表格中 TableActionButton，决定是否生成生成 actions 列，一个表格最多只能有一个 actions 列，必须放在表格的最后一列
}

interface ITableProps {
  columns: <ITableColumnText | ITableColumnTag | ITableColumnActions>[];
  border?: boolean;
  radius?: "none" | "sm" | "md" | "lg";
  backgroundColor: var(--container-bg-color);
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
  optionLayout: 'horizontal' | 'vertical';
}

interface IRadioListProps {
  label: string;
  options: { label: string; value: string }[];
  disabled?: boolean;
  optionLayout: 'horizontal' | 'vertical';
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

interface ITextAreaProps {
  label: string;
  placeholder: string;
  disabled?: boolean;
  rows?: number; // default 3
}

interface IFormTextAreaProps {
  label: string;
  fieldName: string;
  placeholder: string;
  disabled?: boolean;
  rows?: number; // default 3
}

type IWeight = {
  id: WeightId;
  type: 'Page' | 'Container' | 'Form' | 'Modal' | 'Table' | 'Input' | 'Button' | 'TableActionButton' | 'FormInput' | 'FormSelect' | 'FormRadioList' | 'FormCheckbox' | 'FormSwitch' | 'FormSlider' | 'FormDatePicker' | 'FormTextArea' | 'RadioList' | 'Select' | 'Checkbox' | 'Switch' | 'Slider' | 'DatePicker' | 'TextArea';
  parentId: WeightId | null;
  layout: IPageLayout | IContainerLayout | IFormLayout | IModalLayout | ITableLayout | IInputLayout | IButtonLayout | ITableActionButtonLayout | IFormInputLayout | IFormSelectLayout | IFormRadioListLayout | IFormCheckboxLayout | IFormSwitchLayout | IFormSliderLayout | IFormDatePickerLayout | IFormTextAreaLayout | IRadioListLayout | ISelectLayout | ICheckboxLayout | ISwitchLayout | ISliderLayout | IDatePickerLayout | ITextAreaLayout;
  props: IPageProps | IContainerProps | IFormProps | IModalProps | ITableProps | IInputProps | IButtonProps | ITableActionButtonProps | IFormInputProps | IFormSelectProps | IFormRadioListProps | IFormCheckboxProps | IFormSwitchProps | IFormSliderProps | IFormDatePickerProps | IFormTextAreaProps | IRadioListProps | ISelectProps | ICheckboxProps | ISwitchProps | ISliderProps | IDatePickerProps | ITextAreaProps;
};

type IOutput = Record<WeightId, IWeight>;
\`\`\`
</outputDefinition>

<output>
1. 输出合法的 json，不允许包含解释
2. 输出需要符合上方IOutput的类型定义
3. 使用\`\`\`json和\`\`\`包裹输出，最小化缩进和换行
</output>
`