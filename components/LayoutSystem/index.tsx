import React from 'react';
import { IWeightLayoutForRender } from '@/types';

export const AISiteLayoutSystemContainer = ({
  weightType,
  style,
  children,
  paddingY
}: { weightType: string, style?: React.CSSProperties, children: React.ReactNode, paddingY?: number }) => {
  return (
    <div
      data-ai-site-weight-type={weightType}
      data-ai-site-grid-container
      className='relative grid w-full auto-rows-max'
      style={{
        ...style,
        paddingTop: paddingY ? paddingY * 8 : 0,
        paddingBottom: paddingY ? paddingY * 8 : 0,
      }}
    >
      {children}
    </div>
  )
}

export const AISiteLayoutSystemItem = (
  { weightType, layout, children }: {
    weightType?: string,
    layout: IWeightLayoutForRender,
    children: React.ReactNode
  }) => {
  const {
    x,
    width,
    y,
    height,
    minHeight,
    heightMode,
    gridRow = 1,
    yToRow = 0
  } = layout;
  const marginTop = (yToRow) * 8;
  // const height = height * 8;
  return (
    <div
      data-ai-site-weight-type={weightType}
      data-ai-site-grid-item={`yToRow: ${yToRow}; gridRow: ${gridRow}; heightMode: ${heightMode}; minHeight: ${minHeight}; y: ${y}; height: ${height}; x: ${x}; width: ${width}; `}
      className='relative top-0 left-0 px-4 flex'
      style={{
        marginLeft: `${(x) / 24 * 100}%`,
        marginTop,
        width: `${(width) / 24 * 100}%`,
        height: heightMode === 'auto' ? 'max-content' : (height ?? 0) * 8,
        gridArea: `${gridRow} / 1 / ${gridRow + 1} / 2`,
      }}>
      {children}
    </div>
  )
}