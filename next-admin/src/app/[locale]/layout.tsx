import type { Metadata } from "next";

import { AntdRegistry } from '@ant-design/nextjs-registry';
import {
  getTranslations
} from 'next-intl/server';
import "../globals.css";


type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale }
}: Omit<Props, 'children'>): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'index' });

  return {
    title: '管理系统',
    description: '首页描述',
  };
}

export default function BasicLayout({ children, params: { locale } }: Readonly<Props>) {
  return (
    <html lang={locale}>
      <head>
      </head>
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
