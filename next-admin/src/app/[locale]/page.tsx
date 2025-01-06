import React, { useEffect } from 'react'
import Image from "next/image";
import Link from "next/link";
import { Button, Timeline } from "antd";
import {useTranslations} from 'next-intl';
import "../globals.css";

// import styles from '../globals.css';

export default function Home() {
  const t = useTranslations('index');
  return (
    <main className='home'>
        <Image
          src="/favicon.png"
          alt="next-admin"
          width={120}
          height={60}
          style={{borderRadius: 6}}
          priority
        />
        <div className='content'>
          <p>
            {t('desc')}
          </p>

          <h2>{t('log.title')}</h2>

          <div className='timeBox'>
            <Timeline
              items={[
                {
                  children: t('log.1'),
                },
                {
                  children: t('log.2'),
                },
                {
                  children: t('log.3'),
                },
                {
                  children: t('log.5'),
                },
                {
                  children: t('log.6'),
                },
                {
                  color: 'orange',
                  children: t('log.7'),
                }
              ]}
            />
          </div>

          <div>
            <Link href="/dashboard" style={{marginRight: 20}}><Button type="primary">{t('try')}</Button></Link>
          </div>
        </div>
        
      
    </main>
  );
}
