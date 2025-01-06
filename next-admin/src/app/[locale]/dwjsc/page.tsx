'use client'
// import { useTranslations} from 'next-intl';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import FileUpload from '@/components/FileUpload/FileUpload';

export default function Order() {
  const router = useRouter();
  return (
    <Layout curActive='/order'>
      <main style={{ minHeight: 'calc(100vh - 260px)' }}>
        <FileUpload></FileUpload>
      </main>
    </Layout>

  );
}
