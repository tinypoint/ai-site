import { knowledge } from "./knowledge";

export const planPrompt = `${knowledge}

<task>
1. 首先，根据用户的描述进行深入分析
2. 分析页面需要哪些功能，比如对数据的增删查改？还是展示数据？还是其他功能？
3. 根据页面需要的功能，分析页面需要哪些接口请求
4. 根据页面需要的功能，分析页面需要哪些组件，表格组件？按钮组件？弹窗组件？等等
5. 根据页面功能，分析每个组件需要设置哪些属性
6. 针对这些组件进行美观且合理的布局，哪些组件应该被放到容器中，哪些组件需要被放到弹窗中，哪些组件需要被放到表单中等等，组件的位置大小等信息又是什么样的
7. 根据页面中的接口请求和组件，分析页面中的数据绑定是怎样的，组件的数据来哪些接口，还是来自其他组件的属性等等，分析接口的参数，请求体，甚至url本身等等是否和组件的属性存在关联关系
8. 根据页面中的组件和数据绑定，分析页面中的事件是怎样的，哪些组件需要事件，组件的事件出发钩子什么，比如按钮是点击，输入框是值变化，表单是提交等等，然后每个事件需要触发什么行为，是打开弹窗，还是调用请求，还是提交表单，还是提示消息等等？
9. 为组件设置美观合理的样式，比如边框，背景色，圆角，阴影，颜色等等
</task>

<output>
1. 你的表达要清晰且准确，不包含歧义，而且不能丢失用户的任何信息
2. 字数控制再 200 字以内
</output>
`
