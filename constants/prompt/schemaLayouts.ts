import { knowledge } from "./knowledge";

export const schemaLayoutPrompt = `${knowledge}

<task>
1. 深入理解用户的真实需求和系统蓝图为页面生成指定页面的全部组件，并为每个组件设置唯一名称、类型、父子关系，并为组件设置精美的布局和样式，保证页面整体美观，以及合理设置组件的属性
2. 页面级别最外层组件是Page，而非其他组件
</task>

<outputDefinition>
\`\`\`typescript

type WeightId = string; // 组件的唯一标识，格式为：英文组件类型加数字

type IPageLayout = {
  // define self position and size
  display: 'grid';
  gridTemplateColumns: 'repeat(24, 1fr)';
  alignItems: 'start';
  gridTemplateRows: 'auto';
  padding: '8px';
  rowGap: '8px';
  columnGap: '8px';
}

type IContainerLayout = {
  // define self position and size
  gridColumn: string;
  gridRow: string;

  // define self grid
  display: 'grid';
  gridTemplateColumns: 'repeat(24, 1fr)';
  alignItems: 'start';
  gridTemplateRows: 'auto';
  padding: '8px';
  rowGap: '8px';
  columnGap: '8px';
}

type IFormLayout = {
  // define self position and size
  gridColumn: string;
  gridRow: string;

  // define self grid
  display: 'grid';
  gridTemplateColumns: 'repeat(24, 1fr)';
  alignItems: 'start';
  gridTemplateRows: 'auto';
  padding: '8px';
  rowGap: '8px';
  columnGap: '8px';
}

// center of screen
type IModalLayout = {
  // define self size
  width: '600px';

  // define self grid
  display: 'grid';
  gridTemplateColumns: 'repeat(24, 1fr)';
  alignItems: 'start';
  gridTemplateRows: 'auto';
  padding: '8px';
  rowGap: '8px';
  columnGap: '8px';
}

type ITableLayout = {
  // define self position and size
  gridColumn: string;
  gridRow: string;
  minHeight: string;
}

// 占位组件, 不显示，占据空间
type ISpaceLayout = {
  // define self position and size
  gridColumn: string;
  gridRow: string;
  height: string;
}

type ITableActionButtonLayout = {} // don not need to set layout

type IInputLayout = {
  // define self position and size
  gridColumn: string;
  gridRow: string;
  height: '40px'; // default 40px
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
  layout: IPageLayout | IContainerLayout | IFormLayout | IModalLayout | ITableLayout | IInputLayout | IButtonLayout | ISpaceLayout | ITableActionButtonLayout | IFormInputLayout | IFormSelectLayout | IFormRadioListLayout | IFormCheckboxLayout | IFormSwitchLayout | IFormSliderLayout | IFormDatePickerLayout | IFormTextAreaLayout | IRadioListLayout | ISelectLayout | ICheckboxLayout | ISwitchLayout | ISliderLayout | IDatePickerLayout | ITextAreaLayout;
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