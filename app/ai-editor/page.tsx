import 'antd/dist/reset.css';
import '@ant-design/v5-patch-for-react-19';
import { PrimeReactProvider } from 'primereact/api';
import AIEditor from '@/components/AIEditor';
import './index.scss';

export default function AIEditorPage() {
  return (
    <PrimeReactProvider>
      <AIEditor />
    </PrimeReactProvider>
  )
}