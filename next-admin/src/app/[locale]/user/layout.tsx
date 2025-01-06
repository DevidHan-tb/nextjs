import { NextIntlClientProvider, useMessages } from 'next-intl';

type Props = {
    children: React.ReactNode;
    params: { locale: string };
};

export default function LocaleLayout({ children, params: { locale } }: Props) {

    return <NextIntlClientProvider locale={locale}>
        {children}
    </NextIntlClientProvider>
}