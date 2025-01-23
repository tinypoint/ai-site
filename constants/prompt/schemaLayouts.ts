import { knowledge, WeightType } from "./knowledge";

export const schemaLayoutPrompt = `${knowledge}

<task>
1. 进行步骤三：列出网页中需要的全部组件，并为每个组件设置唯一名称、类型、父子关系，并为组件设置精美的布局和样式，保证页面整体美观
2. 深入理解用户的真实需求
3. 深入理解页面规划中布局的相关信息
4. 为页面生成组件，指定组件类型和父级
5. 为每个组件设置合理美观的 layout 和 style
6. 每类组件可以使用的 style 属性有差别，请严格按照下方定义来生成组件 style
</task>

<outputDefinition>
\`\`\`typescript

type GridUnit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;
type ColumnSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;
type Pixel8Multiplier = number & { __brand: '8px-multiplier' }; // 品牌类型确保只接受8的倍数

type WeightName = string; // 组件的唯一标识，格式为：英文组件类型加数组

type ContainerAutoHeightLayout = {
  x: GridUnit;
  width: ColumnSpan;
  heightMode: 'auto';
  y: Pixel8Multiplier;
  minHeight: Pixel8Multiplier;
  paddingY: Pixel8Multiplier;
}

type ContainerFixedHeightLayout = {
  x: GridUnit;
  width: ColumnSpan;
  heightMode: 'fixed';
  y: Pixel8Multiplier;
  height: Pixel8Multiplier;
  paddingY: Pixel8Multiplier;
}

type ContainerLayout = ContainerAutoHeightLayout | ContainerFixedHeightLayout;

type ItemLayout = {
  x: GridUnit; 
  width: ColumnSpan;
  y: Pixel8Multiplier; 
  height: Pixel8Multiplier; 
}

type IPageLayout = ContainerLayout;

type IModalLayout = ContainerLayout & ItemLayout;

type IContainerLayout = ContainerLayout & ItemLayout;

type IFormLayout = ContainerLayout & ItemLayout;

// 其他的非容器组件的布局类型都是 ItemLayout

type IWeightLayout = IPageLayout | IModalLayout | IContainerLayout | IFormLayout | IFormLayout;

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

type IWeightStyle = IPageStyle | IContainerStyle | ITextStyle | IFormStyle | IModalStyle | ITableStyle
    | IButtonStyle | IInputStyle | ISelectStyle | ICheckboxStyle | IRadioListStyle | ISwitchStyle
    | ISliderStyle | IDatePickerStyle | ITextAreaStyle | IFormInputStyle | IFormSelectStyle | IFormCheckboxStyle | IFormRadioListStyle | IFormSwitchStyle | IFormSliderStyle | IFormDatePickerStyle | IFormTextAreaStyle;

${WeightType}

type IWeight = {
  type: IWeightType;
  parent: WeightName | null;
  layout: IWeightLayout;
  style: IWeightStyle;
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