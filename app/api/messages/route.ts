import fs from 'fs';
import path from 'path';
import { Message } from '@/types';

const messagesFilePath = path.resolve(process.cwd(), 'messages.json');

if (!fs.existsSync(messagesFilePath)) {
  fs.writeFileSync(messagesFilePath, JSON.stringify([]));
}

const getMessages = () => {
  try {
    const data = fs.readFileSync(messagesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveMessages = (messages: Message[]) => {
  fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
};

export async function GET() {
  const messages = getMessages();
  return Response.json(messages)
}

export async function POST(req: Request) {
  const newMessage = await req.json();
  const messages = getMessages();
  messages.push(newMessage);
  saveMessages(messages);
  return Response.json(newMessage)
}

export async function DELETE() {
  saveMessages([]); // Clear the messages
  return Response.json({})
}
