import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { NextRequest } from "next/server";
import { Message } from "@/types";
import { schemaAgent } from "@/services/chat";

export async function POST(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  const { messages } = await req.json();

  const langchainMessages = (messages as Message[]).map(msg => {
    if (msg.role === 'user') {
      return new HumanMessage(msg.content)
    } else if (msg.role === 'ai') {
      return new AIMessage(msg.content);
    }

    return new SystemMessage(msg.content)
  })

  schemaAgent(langchainMessages, writer);

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Transfer-Encoding': 'chunked',
    },
  });
} 