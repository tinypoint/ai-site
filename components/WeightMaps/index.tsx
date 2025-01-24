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
import { AISiteLayoutSystemContainer, AISiteLayoutSystemItem } from '@/components/LayoutSystem';
import { WeightCheckbox, WeightFormSelect, WeightSelect, WeightFormRadioList, WeightRadioList, WeightFormSwitch, WeightSwitch, WeightFormSlider, WeightSlider, WeightFormDatePicker, WeightDatePicker, WeightForm, WeightFormInput, WeightInput, WeightFormCheckbox } from './Form';

type ComponentProps = any;

export const weightMaps: Record<IWeightType, React.FC<ComponentProps>> = {
  Page: ({ children, eventHandlers, style }) => {

    useEffect(() => {
      eventHandlers.onPageLoad && eventHandlers.onPageLoad();
    }, [children]);

    return (
      <AISiteLayoutSystemContainer
        weightType="Page"
        style={{
          ...style,
          minHeight: '100vh',
        }}
        paddingY={style.paddingY}
      >
        {children}
      </AISiteLayoutSystemContainer>
    )
  },
  Container: ({ children, layout, style }) => {
    return (
      <AISiteLayoutSystemItem autoHeight={true} layout={layout}>
        <AISiteLayoutSystemContainer
          weightType="Container"
          style={style}
          paddingY={layout.paddingY}
        >
          {children}
        </AISiteLayoutSystemContainer>
      </AISiteLayoutSystemItem>
    )
  },
  Text: ({ content, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <div style={style}>{content}</div>
      </AISiteLayoutSystemItem>
    )
  },

  Button: ({ text, layout, style, eventHandlers, htmlType }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Button
          className='flex-1 w-0'
          onClick={eventHandlers.onClick || undefined}
          style={style}
        >
          {text}
        </Button>
      </AISiteLayoutSystemItem>
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
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className='space-y-0'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <AISiteLayoutSystemContainer
              weightType='Modal'
              paddingY={layout.paddingY}
            >
              {children}
            </AISiteLayoutSystemContainer>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    )
  },
  Table: ({ children, layout, style, columns, dataSource, loading }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <DataTable dataSource={dataSource} columns={columns} loading={loading} />
      </AISiteLayoutSystemItem>
    )
  },
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
};