import type { CSSProperties } from 'react';

export type IWeightName = string;

export interface IBaseSchema {
  [key: IWeightName]: {
    type: string;
    parent: IWeightName | null;
  }
}

export interface ISchemaProps {
  [key: IWeightName]: {
    props: any;
  }
}

export interface IWeightLayout {
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
}

export type IWeightStyle = Pick<CSSProperties, 'color' | 'fontSize' | 'fontWeight' | 'border' | 'borderRadius' | 'backgroundColor' | 'boxShadow' | 'opacity'>;

export interface ISchemaLayout {
  [key: IWeightName]: {
    layout: IWeightLayout;
    style: IWeightStyle;
  }
}

export interface IFinalSchema {
  [key: IWeightName]: {
    type: string;
    parent?: IWeightName | null;
    props?: any;
    layout?: IWeightLayout;
    style?: IWeightStyle;
  }
}