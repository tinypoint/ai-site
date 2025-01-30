export const WeightType = `
type IWeightType = 'Page' | 'Container' | 'Text' | 'Form' | 
'Modal' | 'Table' | 'FormInput' | 'FormSelect' | 'FormRadioList' |
'FormCheckbox' | 'FormSwitch' | 'FormSlider' | 'FormDatePicker' |
'FormTextArea' | 'Button' | 'Input' | 'Select' | 'Checkbox' | 
'RadioList' | 'Switch' | 'Slider' | 'DatePicker' | 'TextArea' | 'TableActionButton'
`

export const knowledge = `
# AI SITE 品牌知识手册
**版本：v1.2 | 更新日期：2025-01-27 | 适用分辨率：1440*1080**

## 一、产品定位
1. **产品名称**：AI SITE
2. **产品定位**：AI驱动的低代码系统搭建平台
3. **核心能力**：根据自然语言描述生成桌面端展示系统

## 二、核心功能流程
### 系统生成七步法
| 步骤 | 功能说明 | 输出标准 |
|------|----------|----------|
| 1    | 创建系统蓝图，指导后续步骤 | 包含系统总体功能描述，页面划分（包含页面路由，是否为首页，页面名称，页面功能，页面中包含的组件以及组件的布局和属性，页面的接口请求，页面中组件和组件，组件和请求接口之间的数据绑定关系，页面中组件的事件交互），系统导航的布局（Header，Sidebar，Main的布局，导航栏的放置位置）的结构化文档 |
| 2    | 定义系统的布局和页面路由的详细信息 | 系统导航的布局，详细的页面的路由配置 |
| 3    | 逐个生产页面 | 从首页开始，逐个生成每个页面 |

### 页面生成6步骤法
| 步骤 | 功能说明 | 输出标准 |
|------|----------|----------|
| 1    | 定义接口请求清单 | 完整接口列表（名称/URL/参数/响应结构） |
| 2    | 组件架构设计 | 带唯一ID的组件树（含类型/父子关系/布局样式/属性） |
| 3    | 生成Mock数据 | 符合接口定义的JSON数据集 |
| 4    | 事件流设计 | 事件-动作映射关系表 |
| 5    | 数据关联配置 | 使用{{expression}}语法的绑定关系表 |
| 6    | 生成最终Schema | 符合AI SITE Schema规范的JSON文件 |


▶ 执行原则：每次对话仅处理一个步骤

## 三、组件体系

### 3.1 组件类型清单

#### 系统导航级组件
| 类型        | 子组件限制                           | 特殊说明                |
|-------------|-------------------------------------|------------------------|
| **Root**    | 只能是 Sidebar、Header、Layout、Main | 整个网页的根容器         |
| **Layout**  | 只能是 Sidebar、Header、Layout、Main | flex容器，用户摆放Sidebar、Header、Main         |
| **Sidebar** | 只能是 Navbar                        | 侧边栏组件              |
| **Header**  | 只能是 Navbar                        | 头部组件，可以横向或纵向，取决于导航栏的放置位置，放在Header中为横向，放在Sidebar中为纵向              |
| **Navbar**  | 无                                   | 导航栏组件，可以横向或纵向，取决于导航栏的放置位置，放在Header中为横向，放在Sidebar中为纵向              |
| **Main**    | 只能是 Page                          | 主内容区组件，具备按照路由展示不同页面的能力             |

#### 容器组件
| 类型        | 子组件限制                  | 特殊说明                  |
|-------------|----------------------------|--------------------------|
| **Page**    | 无                         | 页面容器，放在系统导航的Main中      |
| **Container** | 任意                     | 支持卡片式样式            |
| **Form**    | 仅Form*系列组件            | 表单容器，放在弹窗中宽度24栏          |
| **Table**   | 仅TableActionButton        | 表格列由表格属性声明，表格行操作按钮由TableActionButton组件声明，TableActionButton存在时，表格需要生成操作列，高度至少50，即400px           |
| **Modal**   | 任意                       | 宽度≥12栏                |
| **Tabs**    | 仅TabPane                  | 标签页容器                |
| **Carousel** | 任意                      | 轮播容器                  |

#### 表单控件（Form专用）
| 类型               | 独立使用 | 容器限制 | 默认尺寸    |
|--------------------|----------|----------|-------------|
| **FormInput**      | ❌       | Form     | 40px高度    |
| **FormSelect**     | ❌       | Form     | 40px高度    |
| **FormRadioList**  | ❌       | Form     | 横向40px/纵向动态 |
| **FormCheckbox**   | ❌       | Form     | 40px高度    |
| **FormSwitch**     | ❌       | Form     | 40px高度    |
| **FormSlider**     | ❌       | Form     | 40px高度    |
| **FormDatePicker** | ❌       | Form     | 40px高度    |
| **FormTextArea**   | ❌       | Form     | 80-160px高度|

#### 独立控件（禁止在Form内使用）
| 类型             | 默认尺寸      | 典型用例场景        |
|------------------|---------------|---------------------|
| **Input**        | 40px高度      | 非结构化数据输入    |
| **Select**       | 40px高度      | 独立下拉选择        |
| **RadioList**    | 横向40px/纵向动态 | 独立单选组        |
| **Checkbox**     | 40px高度      | 独立复选框          |
| **Switch**       | 40px高度      | 独立开关控件        |
| **Slider**       | 40px高度      | 独立滑动条          |
| **DatePicker**   | 40px高度      | 独立日期/时间、或日期范围/时间范围选择        |
| **TextArea**     | 80-160px高度  | 独立大段文本输入        |

#### 功能组件
| 类型                | 特殊能力                  | 布局约束              |
|---------------------|--------------------------|-----------------------|
| **Button**          | 支持6种预设样式          | 高度40px           |
| **Chart**           | 支持ECharts全系图表      | 高度 ≥ 160px    |
| **Image**           | 支持动态URL绑定          | 必须设置宽高比        |
| **Text**            | 支持Markdown语法         | 自动换行              |

#### 表格相关
| 类型                  | 容器限制 | 行为特性                  |
|-----------------------|----------|--------------------------|
| **TableActionButton** | 仅Table  | 只能放在表格中，TableActionButton存在时，表格的列属性需要生成操作列      |

#### 标签页系统
| 类型               | 容器限制 | 必需属性          |
|--------------------|----------|-------------------|
| **TabPane**        | 仅Tabs   | 必须设置tabTitle  |

#### Space组件
| 类型               | 容器限制 | 行为特性          |
|--------------------|----------|-------------------|
| **Space**        | 无   | 占据空间，不显示  |

---

### 补充说明：
1. **组件命名规则**：
   - 组件使用**首字母大写+数字**命名（如Table1）

2. **禁用组合**：
\`\`\`javascript
// 错误示例：混合使用表单控件与独立控件
{
    type: 'Container',
    children: [
    { type: 'FormInput' }, // ❌ 非法！FormInput必须位于Form内
    { type: 'Input' }      // ✅ 合法
    ]
}
\`\`\`

3. **尺寸继承规则**：
   - 子组件的width始终相对于父容器宽度
   - 独立控件的高度固定，容器高度可动态调整


### 3.2 布局系统
#### 基于 css grid 布局，但是做了如下限制
1. Page Container Form Modal gridTemplateColumns 固定为 repeat(24, 1fr)，gridTemplateRows 固定为 auto，alignItems 固定为 start
2. Page Container Form Modal gridTemplateRows gap 固定为 8px
3. Page Container Form Modal gridTemplateRows padding 固定为 8px
4. 使用 gridColumn gridRow 来定义组件位置


### 3.3 数据关联规则
#### 表达式语法
\`\`\`javascript
{{ Table1.selectedRow.id }} // 组件状态
{{ QueryUserList.response.data.list }} // 接口响应，response 字段是接口返回的完整数据
\`\`\`

#### 执行原则
1. **单向数据流**：
   - 组件 → 请求参数（用户输入驱动）
   - 请求响应 → 组件属性（数据展示驱动）
2. **安全检测**：自动阻断循环依赖表达式

## 四、设计规范
### 4.1 交互规范
#### 表格控制区：使用Container + Input + Select + ...独立使用的输入类组件 + Button，支持表格搜索、查询、表格操作等功能，组件放在同一个容器中，放置在表格上方
\`\`\`
[示例布局]
| 搜索框(8栏) | 筛选器(6栏) | 查询按钮 | 其他表格操作按钮(如新增、导出) |
\`\`\`
- **排列规则**：输入组件和按钮横向排列，超出一行自动换行
- **响应规则**：输入变化自动刷新和按钮触发可以同时存在

#### 表格设计
- **表格列声明**：使用表格属性声明表格列
- **表格操作列**：表格行操作按钮由TableActionButton组件声明，TableActionButton存在时，表格需要生成操作列，操作列是表格的最后一个列，表格最多只能有一个操作列，操作列中可以放置多个TableActionButton组件

#### 表单设计
- **布局规则**：控件垂直排列，宽度24栏
- **按钮位置**：底部新行右对齐
- **只读表单**：如果仅是展示数据，请使用只读(disabled)表单，不需要按钮

#### 模态框设计
- **层级管理**：不同操作使用独立Modal（如详情/新增/编辑）
- **关闭事件**：必须配置关闭触发逻辑


## 五、异常处理
1. **组件冲突**：自动分离独立控件与表单控件

---
`

