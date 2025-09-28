// app/layout.tsx
import './globals.css';
import './styles/layout.css';
import Head from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { cookies } from 'next/headers';
import {I18nProvider} from "@/components/i18n";
import Footer from "@/components/layout/Footer";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieLang = (await cookies()).get('lang')?.value === 'en' ? 'en' : 'ko';
    // @ts-ignore
    return (
        <html lang={cookieLang} suppressHydrationWarning>
        <body>
        <I18nProvider defaultLang={cookieLang}>
            <Head />

            {/* 페이지 3열 그리드 */}
            <div className="pageGrid">
                <Sidebar />
                <main className="content">{children}</main>
            </div>

            <Footer />
        </I18nProvider>
        </body>
        </html>
    );
}