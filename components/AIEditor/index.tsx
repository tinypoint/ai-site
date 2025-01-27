"use client"
import { toast } from "sonner"
import useChatStore from '@/hooks/useChatStore';
import { useEffect, useRef } from 'react';
import { ReplyOptions, Vessel, VesselMessage } from "@opensea/vessel"
import Chat from '@/components/Chat';
import { RefreshCw, Volume2 } from "lucide-react";
import { Input } from "@/components/ui/input";


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

  const onRefreshClick = () => {
    try {
      iframeRef.current?.contentWindow?.location.reload()
    } catch (error) {
      toast('Failed to refresh')
    }
  }

  return (
    <div className='h-screen w-screen p-4 bg-gray-100'>
      <div className="mx-auto w-full max-w-[1440px] h-full border rounded-md shadow-md overflow-hidden">
        <div className="h-8 w-full bg-white p-2 bg-gray-200 flex">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div className="w-full h-10 bg-white py-1 px-2 flex items-center justify-between">
          <div className="flex items-center">
            <RefreshCw className="w-4 h-4" onClick={onRefreshClick} />
          </div>
          <div className="flex-1 ml-2">
            <Input disabled value="/" className="w-full h-full rounded-full border" />
          </div>
        </div>
        <div className="w-full h-full overflow-x-auto">
          <div className='min-w-[600px] w-full h-full bg-white'>
            <iframe
              ref={iframeRef}
              src="/ai-preview"
              className='w-full h-full border-none'
            />
          </div>
        </div>
      </div>
      <Chat refreshPreview={onRefreshClick} />
    </div>
  );
}