import React from 'react';
import { IWeightLayoutForRender, IContainerWeightLayoutForRender, IWeightStyle } from '@/types';
import clsx from 'clsx';

export const AISiteLayoutSystemContainer = ({
  weightType,
  style,
  children,
  layout,
}: {
  weightType: string,
  style?: IWeightStyle,
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
          height: heightMode === 'auto' ? 'max-content' : (height ?? 0) * 8,
          boxSizing: 'content-box',
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
      {children}
    </div>
  )
}

export const LayoutContainerContent = ({
  weightType,
  style,
  children,
  layout,
  className,
}: {
  weightType: string,
  style?: IWeightStyle,
  children: React.ReactNode,
  layout: IContainerWeightLayoutForRender,
  className?: string,
}) => {
  const {
    height,
    heightMode,
  } = layout;
  return (
    <div
      data-ai-site-weight-type={weightType}
      data-ai-site-grid-container={JSON.stringify(layout)}
      className={clsx('w-full', className)}
      style={{
        ...style,
      }}
    >
      <div
        className={clsx('relative grid w-full', {
          'auto-rows-max': heightMode === 'auto',
        })}
        style={{
          height: heightMode === 'auto' ? undefined : (height ?? 0) * 8,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export const AISiteLayoutSystemItem = (
  { weightType, layout, children, style, className }: {
    weightType?: string,
    layout: IWeightLayoutForRender,
    children: React.ReactNode,
    style?: IWeightStyle,
    className?: string,
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
      className={clsx('relative top-0 left-0 flex px-2', className)}
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