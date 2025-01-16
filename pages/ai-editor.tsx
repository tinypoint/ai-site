import { Layout, Input, Button, message as antdMessage } from 'antd';
import 'antd/dist/reset.css';
import { HumanMessage } from '@langchain/core/messages';
import useChatStore from '../store/chatStore';

const { Sider, Content } = Layout;

export default function AIEditorPage() {
  const { messages, inputValue, setMessages, setInputValue, parseStreamResponse } = useChatStore();

  const handleSend = async (): Promise<void> => {
    if (inputValue.trim()) {
      const userMessage = new HumanMessage(inputValue);
      setMessages([...messages, { type: 'user', text: inputValue }, { type: 'ai', text: '' }]);
      setInputValue('');

      try {
        const response = await fetch('/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: [userMessage] }),
        });

        const reader = response.body!.getReader();
        parseStreamResponse(reader);
      } catch (error) {
        antdMessage.error('Failed to get AI response');
      }
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={300} style={{ background: '#fff', padding: '20px' }}>
        <h2>AI Chat Room</h2>
        <div style={{ marginBottom: '10px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '10px'
            }}>
              <div style={{
                maxWidth: '60%',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: msg.type === 'user' ? '#1890ff' : '#f0f0f0',
                color: msg.type === 'user' ? '#fff' : '#000',
                textAlign: msg.type === 'user' ? 'right' : 'left'
              }}>
                <strong>{msg.type === 'user' ? 'User' : 'AI'}:</strong> {msg.text}
              </div>
            </div>
          ))}
        </div>
        <Input.TextArea
          rows={4}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Type your message..."
        />
        <Button type="primary" onClick={handleSend} style={{ marginTop: '10px' }}>
          Send
        </Button>
      </Sider>
      <Content style={{ padding: '20px' }}>
        <h2>Editor</h2>
        <Input.TextArea rows={20} placeholder="Start typing..." />
      </Content>
    </Layout>
  );
} 