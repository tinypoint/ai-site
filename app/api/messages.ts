import { NextApiRequest, NextApiResponse } from 'next';
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const messages = getMessages();
    res.status(200).json(messages);
  } else if (req.method === 'POST') {
    const newMessage = req.body;
    const messages = getMessages();
    messages.push(newMessage);
    saveMessages(messages);
    res.status(201).json(newMessage);
  } else if (req.method === 'DELETE') {
    saveMessages([]); // Clear the messages
    res.status(204).end(); // No Content
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 