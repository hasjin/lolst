import './globals.css';
import { Inter } from 'next/font/google';

export const metadata = {
    title: 'Seeres LoL Insights',
    description: 'LoL 패치 영향 분석 대시보드',
};

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    preload: true,
    adjustFontFallback: false,
    variable: '--font-inter',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko" className={inter.variable}>
        <head>
            <style>{`html,body{background:#0b1120;color:#e5e7eb} :root{color-scheme:dark}`}</style>
        </head>
        <body>{children}</body>
        </html>
    );
}