import { Layout, Input, Button, message as antdMessage, Steps, Collapse, Avatar } from 'antd';
import useChatStore from '../../store/chatStore';
import ReactMarkdown from 'react-markdown';
import { UserMessage, AIMessage } from '../../store/chatStore';
import { CheckCircleOutlined, LoadingOutlined, SendOutlined, RedoOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import LowCodeRenderer from '../LowCodeRenderer';

const { Sider, Content } = Layout;

export default function AIEditorPage() {
  const { messages, inputValue, setMessages, setInputValue, parseStreamResponse, getLastAIMessage } = useChatStore();

  const handleSend = async (): Promise<void> => {
    if (inputValue.trim()) {
      const userMessage: UserMessage = { role: 'user', content: inputValue };

      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userMessage),
      });

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
        await parseStreamResponse(reader);

        const lastAIMessage = getLastAIMessage();

        await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lastAIMessage),
        });
      } catch (error) {
        antdMessage.error('Failed to get AI response');
      }
    }
  };

  const handleReset = async () => {
    try {
      await fetch('/api/messages', {
        method: 'DELETE',
      });
      setMessages([]);
      setInputValue('学生列表查询页');
    } catch (error) {
      antdMessage.error('Failed to reset messages');
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
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '10px'
              }}>
                <div
                  className='rounded-md p-4 relative max-w-[90%]'
                  style={{
                    backgroundColor: msg.role === 'user' ? '#1890ff' : '#f0f0f0',
                    color: msg.role === 'user' ? '#fff' : '#000',
                  }}>
                  <Avatar
                    style={{
                      // backgroundColor: msg.role === 'user' ? '#1890ff' : '#f0f0f0',
                      color: msg.role === 'user' ? '#fff' : '#000',
                    }}
                  >
                    {msg.role === 'user' ? 'U' : 'AI'}
                  </Avatar>
                  <div
                    style={
                      {
                        textAlign: msg.role === 'user' ? 'right' : 'left',
                      }
                    }
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    {msg.role === 'ai' && msg.progress && (
                      <div>
                        <Collapse>
                          {
                            msg.progress.compeleteSteps.map(step => (
                              <Collapse.Panel header={step} extra={
                                msg.progress!.compeleteSteps.includes(step) ? <CheckCircleOutlined style={{ color: 'green' }} /> : msg.progress!.runningSteps.includes(step) ? <LoadingOutlined style={{ color: 'gray' }} /> : null
                              } key={step}>
                                <ReactMarkdown>{msg.artifact?.[step as keyof typeof msg.artifact] || ''}</ReactMarkdown>
                              </Collapse.Panel>
                            ))
                          }
                          {
                            msg.progress.runningSteps.map(step => (
                              <Collapse.Panel header={step} extra={
                                msg.progress!.compeleteSteps.includes(step) ? <CheckCircleOutlined style={{ color: 'green' }} /> : msg.progress!.runningSteps.includes(step) ? <LoadingOutlined style={{ color: 'gray' }} /> : null
                              } key={step}>
                                <ReactMarkdown>{msg.artifact?.[step as keyof typeof msg.artifact] || ''}</ReactMarkdown>
                              </Collapse.Panel>
                            ))
                          }
                        </Collapse>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
          <div
            className='flex flex-col bg-white p-2 border border-gray-200 rounded-md'
          >
            <Input.TextArea
              variant='borderless'
              className='mb-2 flex-1'
              autoSize={{ minRows: 2, maxRows: 10 }}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Type your message..."
            />
            <div className='flex justify-end gap-2'>
              <Button
                type="dashed"
                icon={<RedoOutlined />}
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
              />
            </div>
          </div>
        </div>
      </Sider>
      <Content style={{
        padding: '20px',
        maxWidth: '80%',
        overflowX: 'auto'
      }}>
        <div style={{ minWidth: '600px', width: '100%', height: '100%', background: '#fff' }}>
          {/* <LowCodeRenderer /> */}
          <iframe
            src="/ai-preview"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </Content>
    </Layout>
  );
}