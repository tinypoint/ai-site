import { useState, useEffect } from 'react';
import { List, Typography } from 'antd';
import 'antd/dist/reset.css';
import { useRouter } from 'next/router';

interface Item {
  name: string;
}

export default function ListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/list');
      const data = await response.json();
      setItems(data.items);
    }
    fetchData();
  }, []);

  const handleEdit = (item: Item) => {
    // 跳转到编辑页面，可以传递参数
    router.push(`/ai-editor?item=${encodeURIComponent(item.name)}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography.Title level={2}>List Management</Typography.Title>
      <List
        bordered
        dataSource={items}
        renderItem={item => (
          <List.Item
            actions={[<a onClick={() => handleEdit(item)}>Edit</a>]}
          >
            {item.name}
          </List.Item>
        )}
      />
    </div>
  );
} 