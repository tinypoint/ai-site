"use client"
import { toast } from "sonner"
import useChatStore from '@/hooks/useChatStore';
import { useEffect, useRef } from 'react';
import { ReplyOptions, Vessel, VesselMessage } from "@opensea/vessel"
import Chat from '@/components/Chat';


export default function AIEditorPage() {
  const { messages, setMessages } = useChatStore();

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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        const data = await response.json();
        setMessages(() => {
          return data;
        });
      } catch (error) {
        toast('Failed to load messages');
      }
    };

    fetchMessages();
  }, [setMessages]);

  return (
    <div className='h-screen'>
      <div className="w-full h-full overflow-x-auto">
        <div className='min-w-[600px] w-full h-full bg-white'>
          {/* <LowCodeRenderer /> */}
          <iframe
            ref={iframeRef}
            src="/ai-preview"
            className='w-full h-full border-none'
          />
        </div>
      </div>
      <Chat />
    </div>
  );
}