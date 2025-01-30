import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { IWeightType } from '@/types';
import useLowCodeStore from '@/hooks/useLowCodeStore';
import { DataTable } from './DataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LayoutItem } from '@/components/LayoutSystem';
import { WeightCheckbox, WeightFormSelect, WeightSelect, WeightFormRadioList, WeightRadioList, WeightFormSwitch, WeightSwitch, WeightFormSlider, WeightSlider, WeightFormDatePicker, WeightDatePicker, WeightForm, WeightFormInput, WeightInput, WeightFormCheckbox } from './Form';
import { WeightChart } from './Chart';
import clsx from 'clsx';

type ComponentProps = any;

export const weightMaps: Record<IWeightType, React.FC<ComponentProps>> = {
  Page: ({ children, eventHandlers, layout, backgroundColor }) => {
    useEffect(() => {
      eventHandlers.onPageLoad && eventHandlers.onPageLoad();
    }, [children]);

    return (
      <div
        data-weight="Page"
        data-layout={JSON.stringify(layout)}
        className={clsx('grid gap-2 p-2 bg-gray-100')}
        style={{
          gridTemplateColumns: 'repeat(24, 1fr)',
        }}
      >
        {children}
      </div>
    )
  },
  Container: ({ children, layout, border, radius }) => {
    return (
      <div
        data-weight="Container"
        data-layout={JSON.stringify(layout)}
        className={clsx('grid gap-2 p-2 bg-white', {
          border: border,
          'rounded-sm': radius === 'sm',
          'rounded-md': radius === 'md',
          'rounded-lg': radius === 'lg',
        })}
        style={{
          gridTemplateColumns: 'repeat(24, 1fr)',
          gridColumn: layout.gridColumn,
          gridRow: layout.gridRow,
        }}
      >
        {children}
      </div>
    )
  },
  Text: ({ content, layout }) => {
    return (
      <LayoutItem
        weightType='Text'
        layout={layout}
        weightId="text"
      >
        <div>{content}</div>
      </LayoutItem>
    )
  },

  Button: ({
    name,
    text,
    layout,
    eventHandlers,
    variant
  }) => {
    return (
      <LayoutItem
        weightType='Button'
        layout={layout}
        weightId={name}
      >
        <Button
          className='flex-1 w-full'
          onClick={eventHandlers.onClick || undefined}
          variant={variant}
        >
          {text}
        </Button>
      </LayoutItem>
    );
  },
  TableActionButton: ({
    name,
    text,
    eventHandlers,
    variant,
  }) => {
    return (
      <Button
        data-weight-id={name}
        data-weight-type="TableActionButton"
        size="sm"
        onClick={eventHandlers.onClick || undefined}
        variant={variant}
      >
        {text}
      </Button>
    )
  },
  Modal: ({ name, title, children, eventHandlers, layout }) => {
    const registerWeight = useLowCodeStore(state => state.registerWeight);
    const unregisterWeight = useLowCodeStore(state => state.unregisterWeight);
    const [open, setOpen] = useState(false);
    useEffect(() => {
      registerWeight(
        name,
        {
          methods: {
            open: () => {
              setOpen(true);
            },
            close: () => {
              setOpen(false);
            }
          }
        }
      )
      return () => {
        unregisterWeight(name);
      }
    });

    const onOpenChange = (open: boolean) => {
      setOpen(open);
      eventHandlers.onClose && eventHandlers.onClose(open);
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger>open</DialogTrigger>
        <DialogContent className='space-y-0'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <div
              data-weight="Modal"
              data-layout={JSON.stringify(layout)}
              className={clsx('grid gap-2 p-2')}
              style={{
                gridTemplateColumns: 'repeat(24, 1fr)',
                gridColumn: layout.gridColumn,
                gridRow: layout.gridRow,
              }}
            >
              {children}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    )
  },
  Table: DataTable,
  Form: WeightForm,
  FormInput: WeightFormInput,
  FormCheckbox: WeightFormCheckbox,
  FormRadioList: WeightFormRadioList,
  FormSwitch: WeightFormSwitch,
  FormSlider: WeightFormSlider,
  FormDatePicker: WeightFormDatePicker,
  FormSelect: WeightFormSelect,
  Input: WeightInput,
  Checkbox: WeightCheckbox,
  RadioList: WeightRadioList,
  Switch: WeightSwitch,
  Slider: WeightSlider,
  DatePicker: WeightDatePicker,
  Select: WeightSelect,
  Chart: WeightChart
};