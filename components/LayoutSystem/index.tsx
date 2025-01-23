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
  const { rowStartToParentContainer,
    rowSpanToParentContainer,
    colStartToParentContainer,
    colSpanToParentContainer,
    gridRow = 1,
    rowStartToParentContainerWithDiff = 0
  } = layout;
  const marginTop = (rowStartToParentContainerWithDiff) * 8;
  const height = autoHeight ? 'max-content' : (rowSpanToParentContainer) * 8;
  // const height = rowSpanToParentContainer * 8;
  return (
    <div
      data-ai-site-grid-item={`rowStartToParentContainerWithDiff: ${rowStartToParentContainerWithDiff}; gridRow: ${gridRow}; rowStartToParentContainer: ${rowStartToParentContainer}; rowSpanToParentContainer: ${rowSpanToParentContainer}; colStartToParentContainer: ${colStartToParentContainer}; colSpanToParentContainer: ${colSpanToParentContainer}; autoHeight: ${autoHeight}`}
      className='relative top-0 left-0 px-2 py-1 flex'
      style={{
        marginLeft: `${(colStartToParentContainer) / 24 * 100}%`,
        marginTop,
        width: `${(colSpanToParentContainer) / 24 * 100}%`,
        height,
        gridArea: `${gridRow} / 1 / ${gridRow + 1} / 2`,
      }}>
      {children}
    </div>
  )
}