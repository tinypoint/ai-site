import { PrimeReactProvider } from 'primereact/api';
import './index.scss';
import LowCodeRenderer from '@/components/LowCodeRenderer';

export default function AIEditorPage() {
  return (
    <PrimeReactProvider>
      <LowCodeRenderer />
    </PrimeReactProvider>
  )
}