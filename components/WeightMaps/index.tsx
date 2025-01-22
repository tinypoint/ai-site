import React, { useEffect, useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IWeightType, IWeightLayoutForRender } from '@/types';
import useLowCodeStore from '@/store/lowcodeStore';
import DataTable from './DataTable';
import { DatePicker } from './DatePicker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Label } from '../ui/label';

type ComponentProps = any;

const AISiteLayoutSystemContainer = ({ weightType, style, children }: { weightType: string, style?: React.CSSProperties, children: React.ReactNode }) => {
  return (
    <div
      data-ai-site-weight-type={weightType}
      data-ai-site-grid-container
      className='relative grid w-full'
      style={style}
    >
      {children}
    </div>
  )
}

const AISiteLayoutSystemItem = ({ autoHeight, layout, children }: { autoHeight?: boolean, layout: IWeightLayoutForRender, children: React.ReactNode }) => {
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
  Form: ({ name, eventHandlers, children, layout, style, labelCol, wrapperCol }) => {
    const registerWeight = useLowCodeStore(state => state.registerWeight);
    const unregisterWeight = useLowCodeStore(state => state.unregisterWeight);
    // const [form] = Form.useForm();

    // useEffect(() => {
    //   registerWeight(
    //     name,
    //     {
    //       methods: {
    //         submit: async () => {
    //           await form.validateFields()
    //           form.submit();
    //         },
    //         reset: () => {
    //           form.resetFields();
    //         },
    //         validate: () => {
    //           form.validateFields();
    //         },
    //       }
    //     }
    //   )
    //   return () => {
    //     unregisterWeight(name);
    //   }
    // });
    return (
      <AISiteLayoutSystemItem autoHeight={true} layout={layout}>
        <Form>
          <AISiteLayoutSystemContainer weightType="Form">
            {children}
          </AISiteLayoutSystemContainer>
        </Form>
        {/* <Form
          className='flex-1 w-0'
          form={form}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          style={style}
          labelAlign='left'
          onFinish={eventHandlers.onSubmit || undefined}
        >
          <AISiteLayoutSystemContainer>
            {children}
          </AISiteLayoutSystemContainer>
        </Form> */}
      </AISiteLayoutSystemItem>
    )
  },
  FormInput: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Input />
        {/* <Form.Item
          className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Input />
        </Form.Item> */}
      </AISiteLayoutSystemItem>
    )
  },
  Input: ({ name, label, layout, placeholder, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <div className="flex w-full items-center space-x-2">
          <Label htmlFor={name} className='shrink-0'>{label}</Label>
          <Input id={name} placeholder={placeholder} />
        </div>
      </AISiteLayoutSystemItem>
    )
  },
  FormCheckboxList: ({ label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Checkbox />
        {/* <Form.Item
          className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Checkbox.Group options={options} />
        </Form.Item> */}
      </AISiteLayoutSystemItem>
    )
  },
  CheckboxList: ({ name, label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <div className="flex w-full items-center space-x-2">
          <Label htmlFor={name} className='shrink-0'>{label}</Label>
          <Checkbox id={name} />
        </div>
        {/* <Form.Item
          className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Checkbox.Group options={options} />
        </Form.Item> */}
      </AISiteLayoutSystemItem>
    )
  },
  Button: ({ text, layout, style, eventHandlers, htmlType }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Button className='flex-1 w-0'>
          {text}
        </Button>
        {/* <Button
          className='flex-1 w-0'
          style={style}
          onClick={eventHandlers.onClick || undefined}
          htmlType={htmlType}
        >
          {text}
        </Button> */}
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
        {/* <Table className={styles['ai-site-table']} style={style} columns={columns} dataSource={dataSource} loading={loading}>{children}</Table>
         */}

        {/* <PrimeTable
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          style={{
            ...style,
            overflow: 'hidden',
          }} /> */}
        <DataTable />
      </AISiteLayoutSystemItem>
    )
  },
  FormSelect: ({ label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        {/* <Form.Item
          label={label}
          className='flex-1 w-0'
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Select options={options} />
        </Form.Item> */}
      </AISiteLayoutSystemItem>
    )
  },
  Select: ({ name, placeholder, label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <div className="flex w-full items-center space-x-2">
          <Label htmlFor={name} className='shrink-0'>{label}</Label>
          {/* <Input id={name} placeholder={placeholder} /> */}
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue id={name} placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {
                options.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        {/* <Form.Item
          label={label}
          className='flex-1 w-0'
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Select options={options} />
        </Form.Item> */}
      </AISiteLayoutSystemItem>
    )
  },
  FormRadioList: ({ label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <RadioGroup defaultValue="option-one">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-one" id="option-one" />
            <Label htmlFor="option-one">Option One</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-two" id="option-two" />
            <Label htmlFor="option-two">Option Two</Label>
          </div>
        </RadioGroup>
        {/* <Form.Item
          className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}
        >
          <Radio.Group options={options} />
        </Form.Item> */}
      </AISiteLayoutSystemItem>
    )
  },
  RadioList: ({ name, label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <div className="flex w-full items-center space-x-2">
          <Label htmlFor={name} className='shrink-0'>{label}</Label>
          {/* <Input id={name} placeholder={placeholder} /> */}
          <RadioGroup className='flex'>
            {
              options.map((option: any) => (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))
            }
          </RadioGroup>
        </div>

        {/* <Form.Item className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Radio.Group options={options} />
        </Form.Item> */}
      </AISiteLayoutSystemItem>
    )
  },
  FormSwitch: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Switch />
        {/* <Form.Item className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Switch />
        </Form.Item> */}
      </AISiteLayoutSystemItem>
    )
  },
  Switch: ({ name, label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <div className="flex w-full items-center space-x-2">
          <Label htmlFor={name} className='shrink-0'>{label}</Label>
          <Switch id={name} />
        </div>
        {/* <Form.Item className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Switch />
        </Form.Item> */}
      </AISiteLayoutSystemItem>
    )
  },
  FormSlider: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Slider />
        {/* <Form.Item className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Slider />
        </Form.Item> */}
      </AISiteLayoutSystemItem>
    )
  },
  Slider: ({ name, label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <div className="flex w-full items-center space-x-2">
          <Label htmlFor={name} className='shrink-0'>{label}</Label>
          <Slider id={name} className='w-full' />
        </div>
        {/* <Form.Item className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Slider />
        </Form.Item> */}
      </AISiteLayoutSystemItem>
    )
  },
  FormDatePicker: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <DatePicker />
        {/* <Form.Item className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <DatePicker />
        </Form.Item> */}
      </AISiteLayoutSystemItem>
    )
  },
  DatePicker: ({ name, label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <div className="flex w-full items-center space-x-2">
          <Label htmlFor={name} className='shrink-0'>{label}</Label>
          <DatePicker />
        </div>
        {/* <Form.Item className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <DatePicker />
        </Form.Item> */}
      </AISiteLayoutSystemItem>
    )
  },
};