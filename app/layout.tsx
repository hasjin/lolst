import './globals.css';
import { I18nProvider } from '@/components/i18n';
import { detectLocaleServer } from '@/lib/locale';

export const metadata = {
    title: 'Seeres LoL Insights',
    description: 'LoL 패치 영향 분석 대시보드',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const defaultLang = await detectLocaleServer(); // 'ko' | 'en'
    return (
        <html lang={defaultLang}>
        <head>
            <style>{`html,body{background:#0b1120;color:#e5e7eb}:root{color-scheme:dark}`}</style>
        </head>
        <body>
        <I18nProvider defaultLang={defaultLang}>
            {children}
        </I18nProvider>
        </body>
        </html>
    );
}