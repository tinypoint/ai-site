import { knowledge } from "./knowledge";

export const navigationPrompt = `${knowledge}

<task>
1. 深入理解用户的真实需求和系统蓝图中的页面划分
2. 生成系统页面路由的详细信息，用json返回
</task>

<outputDefinition>
\`\`\`typescript

type IRoute = {
  path: string; // 页面路径，已/开头,首页为/,子页面需要写全路径
  isHome: boolean; // only one home route
  pageId: string; // 全局唯一的页面英文名称
  title: string;  // 页面中文标题
  children?: IRoute[]; // 子页面
  showInSidebar: boolean; // 是否在侧边栏显示
}

type IWeightId = string;

type IOutput = {
  routes: IRoute[];
};
\`\`\`
</outputDefinition>

<output>
1. 输出合法的 json，不允许包含解释
2. 输出需要符合上方IOutput的类型定义
3. 使用\`\`\`json和\`\`\`包裹输出，最小化缩进和换行
</output>`;