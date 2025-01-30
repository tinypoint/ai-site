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
import { LayoutContainerPosition, LayoutContainerContent, AISiteLayoutSystemItem } from '@/components/LayoutSystem';
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
      <LayoutContainerContent
        weightType="Page"
        layout={layout}
        className="bg-gray-100 min-h-screen p-2"
      >
        {children}
      </LayoutContainerContent>
    )
  },
  Container: ({ children, layout, border, radius }) => {
    return (
      <LayoutContainerPosition
        weightType="Container"
        layout={layout}
      >
        <LayoutContainerContent
          weightType="Container"
          layout={layout}
          className={clsx("bg-white p-2", {
            'border': border,
            'rounded-sm': radius === 'sm',
            'rounded-md': radius === 'md',
            'rounded-lg': radius === 'lg',
          })}
        >
          {children}
        </LayoutContainerContent>
      </LayoutContainerPosition>
    )
  },
  Text: ({ content, layout, style }) => {
    return (
      <AISiteLayoutSystemItem weightType='Text' layout={layout}>
        <div style={style}>{content}</div>
      </AISiteLayoutSystemItem>
    )
  },

  Button: ({
    name,
    text,
    layout,
    style,
    eventHandlers,
    variant
  }) => {
    return (
      <AISiteLayoutSystemItem weightType='Button' layout={layout} className='items-center'>
        <Button
          className='flex-1 w-0'
          onClick={eventHandlers.onClick || undefined}
          style={style}
          variant={variant}
        >
          {text}
        </Button>
      </AISiteLayoutSystemItem>
    )
  },
  TableActionButton: ({
    name,
    text,
    layout,
    style,
    eventHandlers,
    variant,
  }) => {
    return (
      <Button
        size="sm"
        onClick={eventHandlers.onClick || undefined}
        style={style}
        variant={variant}
      >
        {text}
      </Button>
    )
  },
  Modal: ({ name, title, children, style, eventHandlers, layout }) => {
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
            <LayoutContainerContent
              weightType='Modal'
              layout={layout}
              style={style}
            >
              {children}
            </LayoutContainerContent>
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