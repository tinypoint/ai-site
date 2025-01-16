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
}

export type IBaseSchema = Record<IWeightName, Pick<IWeight, 'type' | 'parent'>>;

export type ISchemaProps = Record<IWeightName, Pick<IWeight, 'props'>>;

export type ISchemaLayout = Record<IWeightName, Pick<IWeight, 'layout' | 'style'>>;

export type IFinalSchema = Record<IWeightName, IWeight>;

