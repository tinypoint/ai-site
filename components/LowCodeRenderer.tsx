import React, { useMemo } from 'react';
import { Form, Input, Checkbox, Button, Modal, Table, Select, Radio, Switch, Slider, DatePicker } from 'antd';
import useChatStore from '@/store/chatStore';
import { llmJsonParse } from '@/utils';
import { IFinalSchema, IWeightType, IWeightLayout } from '@/types';

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

        // gridColumnStart: colStart,
        // gridColumnEnd: colSpan,
        // gridRowStart: rowStart,
        // gridrowSpan: rowSpan,
      }}>
      {children}
    </div>
  )
}

const componentMap: Record<IWeightType, React.FC<ComponentProps>> = {
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
  Form: ({ title, children, layout, style, labelCol, wrapperCol }) => {
    return (
      <AISiteLayoutSystemItem autoHeight={true} layout={layout}>
        <Form
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          style={style}
          labelAlign='left'
        >
          <AISiteLayoutSystemContainer>
            {children}
          </AISiteLayoutSystemContainer>
        </Form>
      </AISiteLayoutSystemItem>
    )
  },
  Input: ({ label, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item label={label} style={style}>
          <Input />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  CheckboxList: ({ label, options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Form.Item label={label} style={style}>
          <Checkbox.Group options={options} />
        </Form.Item>
      </AISiteLayoutSystemItem>
    )
  },
  Button: ({ text, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Button style={style}>{text}</Button>
      </AISiteLayoutSystemItem>
    )
  },
  Modal: ({ title, children, style }) => <Modal title={title} open={false} style={style}>{children}</Modal>,
  Table: ({ children, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Table style={style}>{children}</Table>
      </AISiteLayoutSystemItem>
    )
  },
  Select: ({ options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Select options={options} style={style} />
      </AISiteLayoutSystemItem>
    )
  },
  RadioList: ({ options, layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Radio.Group options={options} style={style} />
      </AISiteLayoutSystemItem>
    )
  },
  Switch: ({ layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Switch style={style} />
      </AISiteLayoutSystemItem>
    )
  },
  Slider: ({ layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <Slider style={style} />
      </AISiteLayoutSystemItem>
    )
  },
  DatePicker: ({ layout, style }) => {
    return (
      <AISiteLayoutSystemItem layout={layout}>
        <DatePicker style={style} />
      </AISiteLayoutSystemItem>
    )
  },
};

const LowCodeRenderer: React.FC<{}> = ({ }) => {
  const { messages } = useChatStore();
  const lastAIMessage = messages.findLast((msg) => msg.role === 'ai');

  const data = useMemo(() => {
    const parsedData = llmJsonParse(lastAIMessage?.artifact?.finalSchema || '{}');
    return typeof parsedData === 'object' && parsedData !== null ? parsedData as IFinalSchema : {};
  }, [lastAIMessage?.artifact?.finalSchema]);

  const renderComponent = (key: string): React.ReactNode => {
    const node = data[key];
    if (!node) return null;
    const { type, props, layout, style } = node;
    const Component = componentMap[type];
    if (!Component) return null;

    // Find children of the current component
    const childrenKeys = Object.keys(data).filter(childKey => data[childKey].parent === key);
    // console.log(key, type, props, layout, style);
    return (
      <Component key={key} {...props} layout={layout || {}} style={style || {}}>
        {childrenKeys.map(renderComponent)}
      </Component>
    );
  };

  // Find root components (those without a parent)
  const rootComponents = Object.keys(data).filter(key => data[key].parent === null);

  return (
    <div className="low-code-renderer">
      {rootComponents.map(renderComponent)}
    </div>
  );
};

export default LowCodeRenderer; 