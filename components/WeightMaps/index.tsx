import React, { useEffect, useState } from 'react';
import { Form, Input, Checkbox, Button, Modal, Table, Select, Radio, Switch, Slider, DatePicker } from 'antd';
import { IWeightType, IWeightLayoutForRender } from '@/types';
import styles from './index.module.scss';
import useLowCodeStore from '@/store/lowcodeStore';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Table as PrimeTable } from './Table';

type ComponentProps = any;

const AISiteLayoutSystemContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      data-ai-site-grid-container
      className='relative grid w-full'
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
        </Form>
      </AISiteLayoutSystemItem>
    )
  },
  FormInput: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item
          className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Input />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  Input: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item
          className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Input />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  FormCheckboxList: ({ label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item
          className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Checkbox.Group options={options} />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  CheckboxList: ({ label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item
          className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Checkbox.Group options={options} />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  Button: ({ text, layout, style, eventHandlers, htmlType }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Button
          className='flex-1 w-0'
          style={style}
          onClick={eventHandlers.onClick || undefined}
          htmlType={htmlType}
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
    return (
      <Modal
        title={title}
        open={open}
        onOk={eventHandlers.onOk || undefined}
        onCancel={eventHandlers.onCancel || undefined}
      >
        <AISiteLayoutSystemContainer>
          {children}
        </AISiteLayoutSystemContainer>
      </Modal>
    )
  },
  Table: ({ children, layout, style, columns, dataSource, loading }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        {/* <Table className={styles['ai-site-table']} style={style} columns={columns} dataSource={dataSource} loading={loading}>{children}</Table>
         */}

        <PrimeTable
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          style={{
            ...style,
            overflow: 'hidden',
          }} />
      </AISiteLayoutSystemItem>
    )
  },
  FormSelect: ({ label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item
          label={label}
          className='flex-1 w-0'
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Select options={options} />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  Select: ({ label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item
          label={label}
          className='flex-1 w-0'
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Select options={options} />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  FormRadioList: ({ label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item
          className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}
        >
          <Radio.Group options={options} />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  RadioList: ({ label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Radio.Group options={options} />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  FormSwitch: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Switch />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  Switch: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Switch />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  FormSlider: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Slider />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  Slider: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <Slider />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  FormDatePicker: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <DatePicker />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  DatePicker: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item className='flex-1 w-0'
          label={label}
          style={{
            ...style,
            marginBottom: 0,
          }}>
          <DatePicker />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
};