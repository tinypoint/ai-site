import { PrimeReactProvider } from 'primereact/api';
import './index.scss';
import AIPreview from '@/components/AIPreview';
import Tailwind from 'primereact/passthrough/tailwind';

export default function AIEditorPage() {
  return (
    <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
      <AIPreview />
    </PrimeReactProvider>
  )
}