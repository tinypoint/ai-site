import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { IWeightType } from '@/types';
import useLowCodeStore from '@/store/lowcodeStore';
import DataTable from './DataTable';
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
      <AISiteLayoutSystemContainer weightType="Page" style={style}>
        {children}
      </AISiteLayoutSystemContainer>
    )
  },
  Container: ({ children, layout, style }) => {
    return (
      <AISiteLayoutSystemItem autoHeight={true} layout={layout}>
        <AISiteLayoutSystemContainer weightType="Container" style={style}>
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
  Modal: ({ name, title, children, style, eventHandlers }) => {
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
    //   <Modal
    //   title={title}
    //   open={open}
    //   onOk={eventHandlers.onOk || undefined}
    //   onCancel={eventHandlers.onCancel || undefined}
    // >
    //   <AISiteLayoutSystemContainer>
    //     {children}
    //   </AISiteLayoutSystemContainer>
    // </Modal>
    return (
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    )
  },
  Table: ({ children, layout, style, columns, dataSource, loading }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <DataTable />
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