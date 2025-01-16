import { Layout, Input, Button, message as antdMessage, Steps, Collapse } from 'antd';
import 'antd/dist/reset.css';
import useChatStore from '../store/chatStore';
import ReactMarkdown from 'react-markdown';
import { UserMessage, AIMessage } from '../store/chatStore';
import LowCodeRenderer from '@/components/LowCodeRenderer';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

const { Sider, Content } = Layout;

export default function AIEditorPage() {
  const { messages, inputValue, setMessages, setInputValue, parseStreamResponse } = useChatStore();

  const handleSend = async (): Promise<void> => {
    if (inputValue.trim()) {
      const userMessage: UserMessage = { role: 'user', content: inputValue };
      const aiMessage: AIMessage = { role: 'ai', content: '' };
      setMessages([...messages, userMessage, aiMessage]);
      setInputValue('');

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: [userMessage] }),
        });

        const reader = response.body!.getReader();
        parseStreamResponse(reader);
      } catch (error) {
        antdMessage.error('Failed to get AI response');
      }
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        antdMessage.error('Failed to load messages');
      }
    };

    fetchMessages();
  }, [setMessages]);

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={600} >
        <div style={{ background: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '10px'
              }}>
                <div style={{
                  maxWidth: '90%',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: msg.role === 'user' ? '#1890ff' : '#f0f0f0',
                  color: msg.role === 'user' ? '#fff' : '#000',
                  textAlign: msg.role === 'user' ? 'right' : 'left'
                }}>
                  <strong>{msg.role === 'user' ? 'User' : 'AI'}:</strong> <ReactMarkdown>{msg.content}</ReactMarkdown>
                  {msg.role === 'ai' && msg.progress && (
                    <div>
                      <Collapse>
                        <Collapse.Panel header="Schema Names Details" extra={
                          msg.progress.doneSteps.includes('schemaNames') ? <CheckCircleOutlined style={{ color: 'green' }} /> : <LoadingOutlined style={{ color: 'gray' }} />
                        } key="1">
                          <ReactMarkdown>{msg.artifact?.schemaNames || ''}</ReactMarkdown>
                        </Collapse.Panel>
                        <Collapse.Panel header="Schema Props Details" extra={
                          msg.progress.doneSteps.includes('schemaProps') ? <CheckCircleOutlined style={{ color: 'green' }} /> : null
                        } key="2">
                          <ReactMarkdown>{msg.artifact?.schemaProps || ''}</ReactMarkdown>
                        </Collapse.Panel>
                        <Collapse.Panel header="Schema Layouts Details" extra={
                          msg.progress.doneSteps.includes('schemaLayouts') ? <CheckCircleOutlined style={{ color: 'green' }} /> : null
                        } key="3">
                          <ReactMarkdown>{msg.artifact?.schemaLayouts || ''}</ReactMarkdown>
                        </Collapse.Panel>
                        <Collapse.Panel header="Final Schema Details" extra={
                          msg.progress.doneSteps.includes('finalSchema') ? <CheckCircleOutlined style={{ color: 'green' }} /> : null
                        } key="4">
                          <ReactMarkdown>{msg.artifact?.finalSchema || ''}</ReactMarkdown>
                        </Collapse.Panel>
                      </Collapse>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '10px' }}>
            <Input.TextArea
              rows={1}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Type your message..."
              style={{ flex: 1, marginRight: '10px' }}
            />
            <Button type="primary" onClick={handleSend}>
              Send
            </Button>
          </div>
        </div>
      </Sider>
      <Content style={{ padding: '20px', maxWidth: '80%' }}>
        <LowCodeRenderer />
      </Content>
    </Layout>
  );
}