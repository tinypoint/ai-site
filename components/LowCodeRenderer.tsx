import React, { useMemo } from 'react';
import { Form, Input, Checkbox, Button, Modal, Table, Select, Radio, Switch, Slider, DatePicker } from 'antd';
import useChatStore from '@/store/chatStore';
import { llmJsonParse } from '@/utils';
import { IFinalSchema, IWeightType } from '@/types';

type ComponentProps = any;


const componentMap: Record<IWeightType, React.FC<ComponentProps>> = {
  Page: ({ children }) => <div className="page">{children}</div>,
  Container: ({ children }) => <div className="container">{children}</div>,
  Form: ({ title, children }) => <Form className="form"><h3>{title}</h3>{children}</Form>,
  Input: ({ label, style }) => <Form.Item label={label} style={style}><Input /></Form.Item>,
  CheckboxList: ({ label, options }) => (
    <Form.Item label={label}>
      <Checkbox.Group options={options} />
    </Form.Item>
  ),
  Button: ({ text }) => <Button>{text}</Button>,
  Modal: ({ title, children }) => <Modal title={title} open={false}>{children}</Modal>,
  Table: ({ children }) => <Table>{children}</Table>,
  Select: ({ options }) => <Select options={options} />,
  RadioList: ({ options }) => <Radio.Group options={options} />,
  Switch: () => <Switch />,
  Slider: () => <Slider />,
  DatePicker: () => <DatePicker />,
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
    const { type, props } = node;
    const Component = componentMap[type];
    if (!Component) return null;

    // Find children of the current component
    const childrenKeys = Object.keys(data).filter(childKey => data[childKey].parent === key);

    return (
      <Component key={key} {...props}>
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