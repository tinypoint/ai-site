import { knowledge } from "./knowledge";

export const navigationPrompt = `${knowledge}

<task>
1. 深入理解用户的真实需求和系统蓝图
2. 生成合理的系统导航布局和页面路由划分
</task>

<outputDefinition>
\`\`\`typescript

type IRootLayout = {
  display: 'flex';
  width: '100vw';
  height: '100vh';
  overflow: 'hidden';
}

type IRootProps = {}

type ILayoutLayout = {
  display: 'flex';
  flexDirection: 'row' | 'column';
  flex: string;
  justifyContent: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  width: string;
  height: string;
}

type ILayoutProps = {}

type IHeaderLayout = {
  // define self position and size
  flex: string;
  width: string;
  height: '56px';

  // define self grid
  display: 'grid';
  gridTemplateColumns: 'repeat(24, 1fr)';
  alignItems: 'start';
  gridTemplateRows: 'auto';
  padding: '8px';
  rowGap: '8px';
  columnGap: '8px';
}

type IHeaderProps = {
}

type ISidebarLayout = {
  // define self position and size
  flex: string;
  width: '320px';
  height: string;

  // define self grid
  display: 'grid';
  gridTemplateColumns: 'repeat(24, 1fr)';
  alignItems: 'start';
  gridTemplateRows: 'auto';
  padding: '8px';
  rowGap: '8px';
  columnGap: '8px';
}

type ISidebarProps = {
  enableFold: boolean;
}

type IMainLayout = {
  // define self position and size
  flex: string;
  width: string;
  height: string;

  // define self grid
  display: 'block';
  padding: 0;
  margin: 0;
  overflow: 'hidden auto';
}

type IMainProps = {}

type INavbarLayout = {
  // define self position and size
  gridColumn: string;
  gridRow: string;
  width: string;
  height: '100%';
}

type INavbarProps = {
  mode: 'horizontal' | 'vertical'; // in header use horizontal, in sidebar use vertical
  showLogo: boolean;
  enableSearch: boolean;
  enableUser: boolean;
  enableFold: boolean;
}

type IRoute = {
  path: string;
  isHome: boolean; // only one home route
  pageId: string; // 页面唯一标识，格式为：Page加数字
  title: string;
  children?: IRoute[];
  showInSidebar: boolean;
}

type IWeightId = string;

type IOutput = {
  siteLayout: Record<IWeightId, {
    weightId: IWeightId;
    type: string;
    parentId: IWeightId | null;
    layout: IRootLayout | ILayoutLayout | IHeaderLayout | ISidebarLayout | IMainLayout | INavbarLayout;
    props: IRootProps | ILayoutProps | IHeaderProps | ISidebarProps | IMainProps | INavbarProps;
  }>;
  routes: IRoute[];
};
\`\`\`
</outputDefinition>

<output>
1. 输出合法的 json，不允许包含解释
2. 输出需要符合上方IOutput的类型定义
3. 使用\`\`\`json和\`\`\`包裹输出，最小化缩进和换行
</output>`;