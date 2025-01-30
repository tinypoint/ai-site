import type { CSSProperties } from 'react';

export type IWeightName = string;

export type IWeightType = string;

export type IWeight = {
  type: IWeightType;
  parentId?: IWeightName | null;
  props?: any;
  layout?: React.CSSProperties;
  events?: any;
}

export interface IWeightTreeNode extends IWeight {
  name: string;
  children?: IWeightTreeNode[];
}

export type ISchemaProps = Record<IWeightName, Pick<IWeight, 'props'>>;

export type ISchemaEvents = Record<IWeightName, Pick<IWeight, 'events'>>;

export type IQueryName = string;

export type IWeightExpression = Record<string, IExpression>;

export type IQueryExpression = {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: Record<string, string>;
  cookies?: Record<string, string>;
};

export type ISchemaExpressions = {
  weights: Record<IWeightName, IWeightExpression>;
  querys: Record<IQueryName, IQueryExpression>;
};

export type IQuery = {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: Record<string, string>;
  cookies?: Record<string, string>;
  params?: Record<string, string>;
  response?: any;
}

export type IQuerys = Record<IQueryName, IQuery>;

export type IQueryMockResponse = Record<IQueryName, any>;

export type ISchemaLayout = Record<IWeightName, Pick<IWeight, 'type' | 'parentId' | 'layout' | 'props'>>;

export type IFinalSchema = Record<IWeightName, IWeight>;

export type IFinalData = {
  weights: Record<IWeightName, IWeight>;
  querys: Record<IQueryName, IQuery>;
};

export interface SystemMessage {
  role: 'system';
  content: string;
}
export interface UserMessage {
  id?: number;
  role: 'user';
  content: string;
  avatar?: string;
  name?: string;
}

export interface AIMessage {
  id?: number;
  role: 'ai';
  content: string;
  artifact?: {
    schemaTypes?: string;
    querys?: string;
    schemaProps?: string;
    schemaLayouts?: string;
    finalJSON?: string;
  };
  progress?: {
    runningSteps: string[];
    compeleteSteps: string[];
  };
  avatar?: string;
  name?: string;
  isLoading?: boolean;
}

export type Message = SystemMessage | UserMessage | AIMessage;
