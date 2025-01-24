import React from 'react';
import { IWeightLayoutForRender, IContainerWeightLayoutForRender } from '@/types';

export const AISiteLayoutSystemContainer = ({
  weightType,
  style,
  children,
  layout,
}: {
  weightType: string,
  style?: React.CSSProperties,
  children: React.ReactNode,
  layout: IContainerWeightLayoutForRender,
}) => {
  const {
    x,
    width,
    height,
    heightMode,
    gridRow,
    yToRow,
    marginX,
    marginY,
    paddingX,
    paddingY,
  } = layout;
  return (
    <div
      data-ai-site-weight-type={weightType}
      data-ai-site-grid-container={JSON.stringify(layout)}
      className='w-full'
      style={{
        marginLeft: `${(x) / 24 * 100}%`,
        marginTop: `${(yToRow) * 8}px`,
        width: `${(width) / 24 * 100}%`,
        gridArea: `${gridRow} / 1 / ${gridRow + 1} / 2`,
      }}
    >
      <div
        className='relative grid w-full auto-rows-max'
        style={{
          marginTop: (marginY ?? 0) * 8,
          marginBottom: (marginY ?? 0) * 8,
          marginLeft: (marginX ?? 0) * 8,
          marginRight: (marginX ?? 0) * 8,
          height: heightMode === 'auto' ? 'max-content' : (height ?? 0) * 8,
          boxSizing: 'content-box',
          paddingTop: (paddingY ?? 0) * 8,
          paddingBottom: (paddingY ?? 0) * 8,
          paddingLeft: (paddingX ?? 0) * 8,
          paddingRight: (paddingX ?? 0) * 8,
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export const LayoutContainerPosition = ({
  weightType,
  children,
  layout,
}: {
  weightType: string,
  children: React.ReactNode,
  layout: IContainerWeightLayoutForRender,
}) => {
  const {
    x,
    width,
    heightMode,
    gridRow,
    yToRow,
    marginY,
    marginX,
  } = layout;
  return (
    <div
      data-ai-site-weight-type={weightType}
      data-ai-site-grid-container={JSON.stringify(layout)}
      className='w-full'
      style={{
        marginLeft: `${(x) / 24 * 100}%`,
        marginTop: `${(yToRow) * 8}px`,
        width: `${(width) / 24 * 100}%`,
        gridArea: `${gridRow} / 1 / ${gridRow + 1} / 2`,
        paddingTop: (marginY ?? 0) * 8,
        paddingBottom: (marginY ?? 0) * 8,
        paddingLeft: (marginX ?? 0) * 8,
        paddingRight: (marginX ?? 0) * 8,
      }}
    >
      {children}
    </div>
  )
}

export const LayoutContainerContent = ({
  weightType,
  style,
  children,
  layout,
}: {
  weightType: string,
  style?: React.CSSProperties,
  children: React.ReactNode,
  layout: IContainerWeightLayoutForRender,
}) => {
  const {
    height,
    heightMode,
    paddingX,
    paddingY,
  } = layout;
  return (
    <div
      data-ai-site-weight-type={weightType}
      data-ai-site-grid-container={JSON.stringify(layout)}
      className='w-full'
      style={{
        paddingTop: (paddingY ?? 0) * 8,
        paddingBottom: (paddingY ?? 0) * 8,
        paddingLeft: (paddingX ?? 0) * 8,
        paddingRight: (paddingX ?? 0) * 8,
        ...style,
      }}
    >
      <div
        className='relative grid w-full auto-rows-max'
        style={{
          height: heightMode === 'auto' ? 'max-content' : (height ?? 0 + (paddingY ?? 0) * 2) * 8,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export const AISiteLayoutSystemItem = (
  { weightType, layout, children, style }: {
    weightType?: string,
    layout: IWeightLayoutForRender,
    children: React.ReactNode,
    style?: React.CSSProperties
  }) => {
  const {
    x,
    width,
    height,
    gridRow = 1,
    yToRow = 0,
  } = layout;
  const marginTop = (yToRow) * 8;
  return (
    <div
      data-ai-site-weight-type={weightType}
      data-ai-site-grid-container={JSON.stringify(layout)}
      className='relative top-0 left-0 flex px-4'
      style={{
        marginLeft: `${(x) / 24 * 100}%`,
        marginTop,
        width: `${(width) / 24 * 100}%`,
        height: (height ?? 0) * 8,
        gridArea: `${gridRow} / 1 / ${gridRow + 1} / 2`,
      }}>
      {children}
    </div>
  )
}