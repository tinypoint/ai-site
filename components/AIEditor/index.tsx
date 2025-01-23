"use client"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button';
import useChatStore from '../../store/chatStore';
import ReactMarkdown from 'react-markdown';
import { ChevronRight } from "lucide-react"
import { useEffect, useRef } from 'react';
import { ReplyOptions, Vessel, VesselMessage } from "@opensea/vessel"
import { UserMessage, AIMessage } from '@/types';
import clsx from 'clsx';


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

    const listener = (message: VesselMessage<unknown>, reply: (response?: unknown, options?: ReplyOptions) => void) => {
      if (typeof message.payload === 'object') {
        const payload = message.payload as { type: string };
        if (payload.type === 'iframeReady') {
          reply(messages)
          return true
        }
      }
      return false;
    }
    vessel.current?.addListener('message', listener)

    return () => {
      vessel.current?.removeListener('message', listener)
    }
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
        alert('Failed to get AI response');
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
      alert('Failed to reset messages');
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        alert('Failed to load messages');
      }
    };

    fetchMessages();
  }, [setMessages]);

  return (
    <div className='h-screen flex'>
      <div className="w-25" >
        <div className='bg-white p-2 flex flex-col h-full'>
          <div className='flex-1 overflow-y-auto mb-2'>
            {messages.map((msg, index) => (
              <div key={index} className={clsx('flex flex-col mb-2', msg.role === 'user' ? 'items-end' : 'items-start')}>
                <div
                  className={clsx('rounded-md p-4 relative max-w-[90%]', msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black')}
                >
                  <Avatar
                    className={clsx(msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black')}
                  >
                    {msg.role === 'user' ? 'U' : 'AI'}
                  </Avatar>
                  <div
                    className={clsx('text-sm', msg.role === 'user' ? 'text-right' : 'text-left')}
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    {msg.role === 'ai' && msg.progress && (
                      <div>
                        {
                          msg.progress.compeleteSteps.map(step => (
                            <Collapsible>
                              <CollapsibleTrigger>
                                {step}
                                {
                                  msg.progress!.compeleteSteps.includes(step) ? <ChevronRight className='text-green-500' /> : msg.progress!.runningSteps.includes(step) ? <ChevronRight className='text-gray-500' /> : null
                                }
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <ReactMarkdown>{msg.artifact?.[step as keyof typeof msg.artifact] || ''}</ReactMarkdown>
                              </CollapsibleContent>
                            </Collapsible>
                          ))
                        }
                        {
                          msg.progress.runningSteps.map(step => (
                            <Collapsible>
                              <CollapsibleTrigger>
                                {step}
                                {
                                  msg.progress!.compeleteSteps.includes(step) ? <ChevronRight className='text-green-500' /> : msg.progress!.runningSteps.includes(step) ? <ChevronRight className='text-gray-500' /> : null
                                }
                              </CollapsibleTrigger>
                              <CollapsibleContent>

                                <ReactMarkdown>{msg.artifact?.[step as keyof typeof msg.artifact] || ''}</ReactMarkdown>
                              </CollapsibleContent>
                            </Collapsible>
                          ))
                        }
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
            <Textarea
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
                icon={<ChevronRight />}
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                type="primary"
                icon={<ChevronRight />}
                onClick={handleSend}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-x-auto p-5">
        <div className='min-w-[600px] w-full h-full bg-white'>
          {/* <LowCodeRenderer /> */}
          <iframe
            ref={iframeRef}
            src="/ai-preview"
            className='w-full h-full border-none'
          />
        </div>
      </div>
    </div>
  );
}