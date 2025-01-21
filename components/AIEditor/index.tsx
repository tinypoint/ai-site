"use client"
import { Layout, Input, Button, message as antdMessage, Steps, Collapse, Avatar } from 'antd';
import useChatStore from '../../store/chatStore';
import ReactMarkdown from 'react-markdown';
import { CheckCircleOutlined, LoadingOutlined, SendOutlined, RedoOutlined } from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import { Vessel } from "@opensea/vessel"
import { UserMessage, AIMessage } from '@/types';
import cls from 'classnames';

const { Sider, Content } = Layout;

export default function AIEditorPage() {
  const { messages, inputValue, setMessages, setInputValue, parseStreamResponse, getLastAIMessage } = useChatStore();

  const vessel = useRef<Vessel | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (!vessel.current) {
      vessel.current = new Vessel({
        iframe: iframeRef.current!,
      });
    }
  }, []);

  useEffect(() => {
    vessel.current?.send({
      type: 'updateMessages',
      messages
    }).then((res) => {

    }).catch((err) => {

    });
  }, [messages]);

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
    <Layout className='h-screen'>
      <Sider width={600} >
        <div className='bg-white p-2 flex flex-col h-full'>
          <div className='flex-1 overflow-y-auto mb-2'>
            {messages.map((msg, index) => (
              <div key={index} className={cls('flex flex-col mb-2', msg.role === 'user' ? 'items-end' : 'items-start')}>
                <div
                  className={cls('rounded-md p-4 relative max-w-[90%]', msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black')}
                >
                  <Avatar
                    className={cls(msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black')}
                  >
                    {msg.role === 'user' ? 'U' : 'AI'}
                  </Avatar>
                  <div
                    className={cls('text-sm', msg.role === 'user' ? 'text-right' : 'text-left')}
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    {msg.role === 'ai' && msg.progress && (
                      <div>
                        <Collapse>
                          {
                            msg.progress.compeleteSteps.map(step => (
                              <Collapse.Panel header={step} extra={
                                msg.progress!.compeleteSteps.includes(step) ? <CheckCircleOutlined className='text-green-500' /> : msg.progress!.runningSteps.includes(step) ? <LoadingOutlined className='text-gray-500' /> : null
                              } key={step}>
                                <ReactMarkdown>{msg.artifact?.[step as keyof typeof msg.artifact] || ''}</ReactMarkdown>
                              </Collapse.Panel>
                            ))
                          }
                          {
                            msg.progress.runningSteps.map(step => (
                              <Collapse.Panel header={step} extra={
                                msg.progress!.compeleteSteps.includes(step) ? <CheckCircleOutlined className='text-green-500' /> : msg.progress!.runningSteps.includes(step) ? <LoadingOutlined className='text-gray-500' /> : null
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
        <div className='min-w-[600px] w-full h-full bg-white'>
          {/* <LowCodeRenderer /> */}
          <iframe
            ref={iframeRef}
            src="/ai-preview"
            className='w-full h-full'
          />
        </div>
      </Content>
    </Layout>
  );
}