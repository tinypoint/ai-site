import 'antd/dist/reset.css';
import '@ant-design/v5-patch-for-react-19';
import { PrimeReactProvider } from 'primereact/api';
import './index.scss';
import AIPreview from '@/components/AIPreview';

export default function AIEditorPage() {
  return (
    <PrimeReactProvider>
      <AIPreview />
    </PrimeReactProvider>
  )
}