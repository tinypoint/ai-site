"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input"
import { ChatMessageList } from "@/components/ui/chat/chat-message-list"

import { CircleCheck, LoaderCircle, MessageCirclePlus, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { toast } from "sonner"
import useChatStore from "@/hooks/useChatStore";
import { motion } from "framer-motion";
import {
  CopyIcon,
  CornerDownLeft,
  Mic,
  Paperclip,
  RefreshCcw,
  Volume2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { AIMessage, UserMessage } from "@/types";
import ReactMarkdown from "react-markdown";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const prompts = [
  '库存管理系统',
  '仪表盘页面，上方是4个图表，然后是表格操作区，有输入框，选择框，查询按钮，然后下方左侧是表格，右侧是一个表单可以提交数据',
  '学生列表管理页',

]

const ChatAiIcons = [
  {
    icon: CopyIcon,
    label: "Copy",
  },
  {
    icon: RefreshCcw,
    label: "Refresh",
  },
  {
    icon: Volume2,
    label: "Volume",
  },
];

export default function Chat({ refreshPreview }: { refreshPreview: () => void }) {
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);
  const getLastAIMessage = useChatStore((state) => state.getLastAIMessage);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const input = useChatStore((state) => state.input);
  const setInput = useChatStore((state) => state.setInput);
  const handleInputChange = useChatStore((state) => state.handleInputChange);
  const parseStreamResponse = useChatStore((state) => state.parseStreamResponse);
  const [isLoading, setisLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTemp, setIsOpenTemp] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const getMessageVariant = (role: string) =>
    role === "ai" ? "received" : "sent";
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isOpen) {
      setIsOpenTemp(false)
    }

    setIsOpen(!isOpen);
  }

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (input.trim()) {
      const userMessage: UserMessage = {
        id: messages.length + 1,
        avatar: selectedUser.avatar,
        name: selectedUser.name,
        role: "user",
        content: input.trim(),
      };
      const aiMessage: AIMessage = {
        id: messages.length + 2,
        avatar: "",
        name: "ChatBot",
        role: "ai",
        content: "",
        isLoading: true,
      };

      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userMessage),
      });

      setMessages((messages) => [
        ...messages,
        userMessage,
        aiMessage
      ]);
      setisLoading(true);

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

        setIsOpen(false)
        refreshPreview()

        const lastAIMessage = getLastAIMessage();

        await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lastAIMessage),
        });
      } catch (error) {
        console.log('error', error);
        toast('Failed to get AI response');
      } finally {
        setisLoading(false);
      }
    }

    setInput("");
    formRef.current?.reset();
  };
  const handleReset = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await fetch('/api/messages', {
        method: 'DELETE',
      });
      setisLoading(false);
      setMessages(() => {
        return [];
      });
      if (inputRef.current) {
        inputRef.current.value = prompts[0];
      }
      setInput(prompts[0]);
    } catch (error) {
      toast('Failed to reset messages');
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = prompts[0];
    }
    setInput(prompts[0]);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isOpen) {
        setIsOpenTemp(false)
        return
      }
      if (e.key === 'Meta') {
        setIsOpenTemp(true)
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (isOpen) {
        setIsOpenTemp(false)
        return
      }
      if (e.key === 'Meta') {
        setIsOpenTemp(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  const isShow = isOpen ? isOpen : isOpenTemp;

  return (
    <>
      <motion.div
        className={clsx("border rounded-lg absolute top-4 bottom-4 shadow-sm left-4 shrink-0 bg-white w-[500px]", isShow ? "opacity-100" : "opacity-0 w-0 max-0 overflow-hidden pointer-events-none")}
        layout
        transition={{
          opacity: {
            type: "tween",
            duration: 0.15,
          },
          layout: {
            type: "tween",
            duration: 0.15,
          },
        }}
      >
        <div className={clsx("flex h-full w-full flex-col", isShow ? "w-lg min-w-lg max-w-lg" : "w-md min-w-md max-w-md")}>
          <div className="flex-1 w-full overflow-y-auto">
            <ChatMessageList ref={messagesContainerRef}>
              {/* Chat messages */}
              {messages.map((message, index) => {
                const variant = getMessageVariant(message.role!);
                return (
                  <motion.div
                    key={index}
                    // layout
                    initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                    transition={{
                      opacity: { duration: 0.1 },
                      // layout: {
                      //   type: "spring",
                      //   bounce: 0.3,
                      //   duration: index * 0.05 + 0.2,
                      // },
                    }}
                    style={{ originX: 0.5, originY: 0.5 }}
                    className="flex flex-col gap-2"
                  >
                    <ChatBubble
                      key={index}
                      variant={variant}
                      className="max-w-[90%]"
                    >

                      <ChatBubbleMessage isLoading={message.role === "ai" ? message.isLoading : undefined}>
                        <Avatar>
                          <AvatarImage
                            src={message.role !== "user" ? "" : message.avatar}
                            alt="Avatar"
                            className={message.role !== "user" ? "dark:invert" : ""}
                          />
                          <AvatarFallback>
                            {message.role !== "user" ? "🤖" : "GG"}
                          </AvatarFallback>
                        </Avatar>
                        <ReactMarkdown className="prose prose-sm">{message.content}</ReactMarkdown>
                        {message.role === 'ai' && (
                          <div>
                            <Accordion type="multiple" className="w-full">
                              {
                                (message.artifact?.compeleteSteps?.includes('navigation')
                                  || message.artifact?.runningSteps?.includes('navigation'))
                                && <AccordionItem key="navigation" value="navigation">
                                  <AccordionTrigger>
                                    <div className="flex items-center gap-2">
                                      {
                                        message.artifact?.compeleteSteps?.includes('navigation') ?
                                          <CircleCheck
                                            className='text-green-500 w-4 h-4'
                                          /> : message.artifact?.runningSteps.includes('navigation') ?
                                            <LoaderCircle
                                              className='text-gray-500 animate-spin w-4 h-4'
                                            /> : null
                                      }
                                      路由信息
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <ReactMarkdown className="prose prose-sm">{message.artifact?.navigation || ''}</ReactMarkdown>
                                  </AccordionContent>
                                </AccordionItem>
                              }
                              {
                                Object.entries(message.artifact?.pages || {}).map(([pageId, page]) => {
                                  return (
                                    <>
                                      {[...page.compeleteSteps, ...page.runningSteps].map(step => {
                                        return (
                                          <AccordionItem key={step} value={step}>
                                            <AccordionTrigger>
                                              <div className="flex items-center gap-2">
                                                {
                                                  page!.compeleteSteps?.includes(step) ?
                                                    <CircleCheck
                                                      className='text-green-500 w-4 h-4'
                                                    /> : page!.runningSteps?.includes(step) ?
                                                      <LoaderCircle
                                                        className='text-gray-500 animate-spin w-4 h-4'
                                                      /> : null
                                                }
                                                {step}
                                              </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                              <ReactMarkdown className="prose prose-sm">{page![step as keyof typeof message.artifact] || ''}</ReactMarkdown>
                                            </AccordionContent>
                                          </AccordionItem>
                                        )
                                      })}
                                      {
                                        page?.dsl ? (
                                          <AccordionItem key="final" value="final">
                                            <AccordionTrigger>
                                              <div className="flex items-center gap-2">
                                                <CircleCheck
                                                  className='text-green-500 w-4 h-4'
                                                />
                                                schema
                                              </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                              <ReactMarkdown className="prose prose-sm">{`\`\`\`json\n${JSON.stringify(page?.dsl || '{}', null, 2)}\n\`\`\``}</ReactMarkdown>
                                            </AccordionContent>
                                          </AccordionItem>
                                        ) : null
                                      }
                                    </>
                                  )
                                })
                              }
                            </Accordion>
                          </div>
                        )}
                        {message.role === "ai" && (
                          <div className="flex items-center mt-1.5 gap-1">
                            {!message.isLoading && (
                              <>
                                {ChatAiIcons.map((icon, index) => {
                                  const Icon = icon.icon;
                                  return (
                                    <ChatBubbleAction
                                      variant="outline"
                                      className="size-6"
                                      key={index}
                                      icon={<Icon className="size-3" />}
                                      onClick={() =>
                                        console.log(
                                          "Action " +
                                          icon.label +
                                          " clicked for message " +
                                          index,
                                        )
                                      }
                                    />
                                  );
                                })}
                              </>
                            )}
                          </div>
                        )}
                      </ChatBubbleMessage>
                    </ChatBubble>
                  </motion.div>
                );
              })}
            </ChatMessageList>
          </div>
          <div className="px-4 pb-4">
            <form
              ref={formRef}
              onSubmit={handleSendMessage}
              className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            >
              <ChatInput
                ref={inputRef}
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                className="min-h-12 max-h-24 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center p-3 pt-0">
                <Button variant="ghost" size="icon">
                  <Paperclip className="size-4" />
                  <span className="sr-only">Attach file</span>
                </Button>

                <Button variant="ghost" size="icon">
                  <Mic className="size-4" />
                  <span className="sr-only">Use Microphone</span>
                </Button>
                <Button
                  size="sm"
                  className="ml-auto gap-1.5 w-8"
                  onClick={toggle}
                >
                  {isShow ? <PanelLeftClose className="size-3.5" /> : <PanelLeftOpen className="size-3.5" />}
                </Button>
                <Button
                  size="sm"
                  className="ml-2 gap-1.5"
                  onClick={handleReset}
                >
                  New Chat
                  <MessageCirclePlus className="size-3.5" />
                </Button>
                <Button
                  disabled={!input || isLoading}
                  type="submit"
                  size="sm"
                  className="ml-2 gap-1.5"
                >
                  Send
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </div >
      </motion.div>
      <motion.div
        className={clsx("absolute bottom-12 shadow-sm left-4 shrink-0", isShow ? "opacity-0" : "opacity-100")}
        layout
        transition={{
          opacity: {
            type: "tween",
            duration: 0.15,
          },
          layout: {
            type: "tween",
            duration: 0.15,
          },
        }}
      >

        <Button
          size="sm"
          className="ml-auto gap-1.5 w-8"
          onClick={toggle}
        >
          {isShow ? <PanelLeftClose className="size-3.5" /> : <PanelLeftOpen className="size-3.5" />}
        </Button>
      </motion.div>
    </>
  );
}