import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 返回一个简单的列表数据
    res.status(200).json({ items: ['Item 1', 'Item 2', 'Item 3'] });
  } else {
    // 处理其他请求方法
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 