import React from 'react';
import clsx from 'clsx';

export const LayoutItem = ({
  children,
  layout,
  weightType,
  weightId,
}: {
  children: React.ReactNode
  layout: React.CSSProperties,
  weightType: string,
  weightId: string,
}) => {
  return (
    <div
      data-weight-id={weightId}
      data-weight-type={weightType}
      data-layout={JSON.stringify(layout)}
      className={clsx('')}
      style={{
        gridColumn: layout.gridColumn,
        gridRow: layout.gridRow,
      }}
    >
      {children}
    </div>
  )
}