import type { CSSProperties } from 'react';

export type IWeightName = string;

export type IWeightType = string;

export interface IWeightLayout {
  rowStartToParentContainer: number;
  rowSpanToParentContainer: number;
  colStartToParentContainer: number;
  colSpanToParentContainer: number;
}

export type IWeightStyle = Pick<CSSProperties, 'color' | 'fontSize' | 'fontWeight' | 'border' | 'borderRadius' | 'backgroundColor' | 'boxShadow' | 'opacity'>;

export type IWeight = {
  type: IWeightType;
  parent?: IWeightName | null;
  props?: any;
  layout?: IWeightLayout;
  style?: IWeightStyle;
  events?: any;
}

export type IBaseSchema = Record<IWeightName, Pick<IWeight, 'type' | 'parent'>>;

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
  response?: any;
}

export type IQuerys = Record<IQueryName, IQuery>;

export type IQueryMockResponse = Record<IQueryName, any>;

export type ISchemaLayout = Record<IWeightName, Pick<IWeight, 'layout' | 'style'>>;

export type IFinalSchema = Record<IWeightName, IWeight>;

export type IFinalData = {
  weights: Record<IWeightName, IWeight>;
  querys: Record<IQueryName, IQuery>;
};
