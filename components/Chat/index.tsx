"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChatInput } from "@/components/ui/chat/chat-input"
import { ChatMessageList } from "@/components/ui/chat/chat-message-list"

import { ChevronRight, MessageCirclePlus } from "lucide-react"
import { toast } from "sonner"
import useChatStore from "@/hooks/useChatStore";
import { AnimatePresence, motion } from "framer-motion";
import {
  CopyIcon,
  CornerDownLeft,
  Mic,
  Paperclip,
  RefreshCcw,
  Volume2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AIMessage, UserMessage } from "@/types";
import ReactMarkdown from "react-markdown";

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

export default function Page() {
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);
  const getLastAIMessage = useChatStore((state) => state.getLastAIMessage);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const input = useChatStore((state) => state.input);
  const setInput = useChatStore((state) => state.setInput);
  const handleInputChange = useChatStore((state) => state.handleInputChange);
  const parseStreamResponse = useChatStore((state) => state.parseStreamResponse);
  const [isLoading, setisLoading] = useState(false);

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

        const lastAIMessage = getLastAIMessage();

        await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lastAIMessage),
        });
      } catch (error) {
        toast('Failed to get AI response');
      }
    }

    setInput("");
    formRef.current?.reset();
  };

  const handleReset = async () => {
    try {
      await fetch('/api/messages', {
        method: 'DELETE',
      });
      setMessages(() => {
        return [];
      });
      setInput('学生列表查询页');
    } catch (error) {
      toast('Failed to reset messages');
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = '学生列表查询页';
    }
    setInput('学生列表查询页');
  }, []);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 w-full overflow-y-auto bg-muted/40">
        <ChatMessageList ref={messagesContainerRef}>
          {/* Chat messages */}
          <AnimatePresence>
            {messages.map((message, index) => {
              const variant = getMessageVariant(message.role!);
              return (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                  transition={{
                    opacity: { duration: 0.1 },
                    layout: {
                      type: "spring",
                      bounce: 0.3,
                      duration: index * 0.05 + 0.2,
                    },
                  }}
                  style={{ originX: 0.5, originY: 0.5 }}
                  className="flex flex-col gap-2 p-4"
                >
                  <ChatBubble key={index} variant={variant}>
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
                    <ChatBubbleMessage isLoading={message.role === "ai" ? message.isLoading : undefined}>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                      {message.role === 'ai' && message.progress && (
                        <div>
                          {
                            message.progress.compeleteSteps.map(step => (
                              <Collapsible>
                                <CollapsibleTrigger>
                                  {step}
                                  {
                                    message.progress!.compeleteSteps.includes(step) ? <ChevronRight className='text-green-500' /> : message.progress!.runningSteps.includes(step) ? <ChevronRight className='text-gray-500' /> : null
                                  }
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <ReactMarkdown>{message.artifact?.[step as keyof typeof message.artifact] || ''}</ReactMarkdown>
                                </CollapsibleContent>
                              </Collapsible>
                            ))
                          }
                          {
                            message.progress.runningSteps.map(step => (
                              <Collapsible>
                                <CollapsibleTrigger>
                                  {step}
                                  {
                                    message.progress!.compeleteSteps.includes(step) ? <ChevronRight className='text-green-500' /> : message.progress!.runningSteps.includes(step) ? <ChevronRight className='text-gray-500' /> : null
                                  }
                                </CollapsibleTrigger>
                                <CollapsibleContent>

                                  <ReactMarkdown>{message.artifact?.[step as keyof typeof message.artifact] || ''}</ReactMarkdown>
                                </CollapsibleContent>
                              </Collapsible>
                            ))
                          }
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
          </AnimatePresence>
        </ChatMessageList>
      </div>
      <div className="px-4 pb-4 bg-muted/40">
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
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
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
              disabled={!input || isLoading}
              size="sm"
              className="ml-auto gap-1.5"
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
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div >
  );
}