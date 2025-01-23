import React from 'react';
import { IWeightLayoutForRender } from '@/types';

export const AISiteLayoutSystemContainer = ({ weightType, style, children }: { weightType: string, style?: React.CSSProperties, children: React.ReactNode }) => {
  return (
    <div
      data-ai-site-weight-type={weightType}
      data-ai-site-grid-container
      className='relative grid w-full auto-rows-max'
      style={style}
    >
      {children}
    </div>
  )
}

export const AISiteLayoutSystemItem = ({ autoHeight, layout, children }: { autoHeight?: boolean, layout: IWeightLayoutForRender, children: React.ReactNode }) => {
  const { x,
    width,
    y,
    height,
    gridRow = 1,
    rowStartToParentContainerWithDiff = 0
  } = layout;
  const marginTop = (rowStartToParentContainerWithDiff) * 8;
  // const height = height * 8;
  return (
    <div
      data-ai-site-grid-item={`rowStartToParentContainerWithDiff: ${rowStartToParentContainerWithDiff}; gridRow: ${gridRow}; x: ${x}; width: ${width}; y: ${y}; height: ${height}; autoHeight: ${autoHeight}`}
      className='relative top-0 left-0 px-2 py-1 flex'
      style={{
        marginLeft: `${(x) / 24 * 100}%`,
        marginTop,
        width: `${(width) / 24 * 100}%`,
        height: autoHeight ? 'max-content' : (height) * 8,
        gridArea: `${gridRow} / 1 / ${gridRow + 1} / 2`,
      }}>
      {children}
    </div>
  )
}