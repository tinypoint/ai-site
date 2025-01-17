import React, { useEffect, useState } from 'react';
import { Form, Input, Checkbox, Button, Modal, Table, Select, Radio, Switch, Slider, DatePicker } from 'antd';
import { IWeightType, IWeightLayout } from '@/types';
import styles from './index.module.scss';
import useLowCodeStore from '@/store/lowcodeStore';

type ComponentProps = any;

const AISiteLayoutSystemContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      data-ai-site-grid-container
      style={{
        position: 'relative',
        display: 'grid',
      }}
    >
      {children}
    </div>
  )
}

const AISiteLayoutSystemItem = ({ autoHeight, layout, children }: { autoHeight?: boolean, layout: IWeightLayout, children: React.ReactNode }) => {
  const { rowStartToParentContainer, rowSpanToParentContainer, colStartToParentContainer, colSpanToParentContainer } = layout;
  const marginTop = (rowStartToParentContainer - 1) * 8;
  const height = autoHeight ? 'auto' : (rowSpanToParentContainer) * 8;
  return (
    <div
      data-ai-site-grid-item={`rowStartToParentContainer: ${rowStartToParentContainer}; rowSpanToParentContainer: ${rowSpanToParentContainer}; colStartToParentContainer: ${colStartToParentContainer}; colSpanToParentContainer: ${colSpanToParentContainer}; autoHeight: ${autoHeight}`}
      style={{
        position: 'relative',
        top: 0,
        left: 0,
        marginLeft: `${(colStartToParentContainer - 1) / 24 * 100}%`,
        marginTop,
        width: `${(colSpanToParentContainer) / 24 * 100}%`,
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gridColumnStart: 1,
        gridColumnEnd: 2,
        gridRowStart: 1,
        gridRowEnd: 2,
        padding: '4px 8px',

        // gridColumnStart: colStart,
        // gridColumnEnd: colSpan,
        // gridRowStart: rowStart,
        // gridrowSpan: rowSpan,
      }}>
      {children}
    </div>
  )
}

export const weightMaps: Record<IWeightType, React.FC<ComponentProps>> = {
  Page: ({ children, style }) => {
    return (
      <AISiteLayoutSystemContainer>
        {children}
      </AISiteLayoutSystemContainer>
    )
  },
  Container: ({ children, layout, style }) => {
    return (
      <AISiteLayoutSystemItem autoHeight={true} layout={layout}>
        <AISiteLayoutSystemContainer>
          {children}
        </AISiteLayoutSystemContainer>
      </AISiteLayoutSystemItem>
    )
  },
  Form: ({ name, eventHandlers, children, layout, style, labelCol, wrapperCol }) => {
    const registerWeight = useLowCodeStore(state => state.registerWeight);
    const unregisterWeight = useLowCodeStore(state => state.unregisterWeight);
    const [form] = Form.useForm();

    useEffect(() => {
      registerWeight(
        name,
        {
          methods: {
            submit: async () => {
              await form.validateFields()
              form.submit();
            },
            reset: () => {
              form.resetFields();
            },
            validate: () => {
              form.validateFields();
            },
          }
        }
      )
      return () => {
        unregisterWeight(name);
      }
    });
    return (
      <AISiteLayoutSystemItem autoHeight={true} layout={layout}>
        <Form
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
        </Form>
      </AISiteLayoutSystemItem>
    )
  },
  FormInput: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item
          label={label}
          style={style}>
          <Input />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  Input: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item
          label={label}
          style={style}>
          <Input />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  FormCheckboxList: ({ label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item
          label={label}
          style={style}>
          <Checkbox.Group options={options} />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  CheckboxList: ({ label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item
          label={label}
          style={style}>
          <Checkbox.Group options={options} />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  FormSubmitButton: ({ text, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Button style={style} htmlType='submit'>{text}</Button>
      </AISiteLayoutSystemItem>
    )
  },
  Button: ({ text, layout, style, eventHandlers }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Button style={style} onClick={eventHandlers.onClick || undefined}>{text}</Button>
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
    return (
      <Modal
        title={title}
        open={open}
        onOk={eventHandlers.onOk || undefined}
        onCancel={eventHandlers.onCancel || undefined}
      >{children}
      </Modal>
    )
  },
  Table: ({ children, layout, style, columns }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Table className={styles['ai-site-table']} style={style} columns={columns}>{children}</Table>
      </AISiteLayoutSystemItem>
    )
  },
  FormSelect: ({ label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item label={label} style={style}>
          <Select options={options} />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  Select: ({ label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item label={label} style={style}>
          <Select options={options} />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  FormRadioList: ({ label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item label={label} style={style}>
          <Radio.Group options={options} />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  RadioList: ({ label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item label={label} style={style}>
          <Radio.Group options={options} />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  FormSwitch: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item label={label} style={style}>
          <Switch />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  Switch: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item label={label} style={style}>
          <Switch />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  FormSlider: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item label={label} style={style}>
          <Slider />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  Slider: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item label={label} style={style}>
          <Slider />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  FormDatePicker: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item label={label} style={style}>
          <DatePicker />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  DatePicker: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item label={label} style={style}>
          <DatePicker />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
};