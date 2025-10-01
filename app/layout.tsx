/**
 * 루트 레이아웃 컴포넌트
 *
 * 역할:
 * - 모든 페이지의 공통 레이아웃 제공
 * - 헤더, 사이드바, 메인 콘텐츠, 푸터를 포함한 전체 구조 정의
 * - 다국어 설정을 쿠키에서 읽어와 I18nProvider로 전역 언어 상태 관리
 *
 * 수정 가이드:
 * - 전체 레이아웃 구조 변경: 아래 JSX의 div.pageGrid 구조 수정
 * - 레이아웃 스타일 변경: app/styles/layout.css의 .pageGrid 클래스 수정
 * - 다국어 기본값 변경: cookieLang 로직 수정
 */

import './globals.css';
import './styles/layout.css';
import Head from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { cookies } from 'next/headers';
import {I18nProvider} from "@/components/i18n";
import Footer from "@/components/layout/Footer";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // 쿠키에서 사용자 언어 설정 읽기 (기본값: 'ko')
    const cookieLang = (await cookies()).get('lang')?.value === 'en' ? 'en' : 'ko';
    const cookieTheme = (await cookies()).get('theme')?.value;

    // @ts-ignore - Next.js의 suppressHydrationWarning 관련 타입 이슈 무시
    return (
        <html lang={cookieLang} suppressHydrationWarning>
        <head>
            <script dangerouslySetInnerHTML={{
                __html: `
                    (function() {
                        const theme = document.cookie.match(/theme=(light|dark)/)?.[1] ||
                                     (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                        document.documentElement.setAttribute('data-theme', theme);
                    })();
                `
            }} />
        </head>
        <body>
            {/* 다국어 Provider: 전체 앱을 감싸서 언어 상태 제공 */}
            <I18nProvider defaultLang={cookieLang}>
                {/* 상단 헤더: 로고, 검색창, 언어 전환 버튼 */}
                <Head />

                {/* 페이지 그리드: 사이드바 + 메인 콘텐츠 2열 레이아웃 */}
                <div className="pageGrid">
                    {/* 좌측 사이드바: 네비게이션 메뉴 */}
                    <Sidebar />

                    {/* 메인 콘텐츠 영역: 각 페이지의 내용이 렌더링됨 */}
                    <main className="content">{children}</main>
                </div>

                {/* 하단 푸터: 이용약관, 개인정보 처리방침, Riot 고지 */}
                <Footer />
            </I18nProvider>
        </body>
        </html>
    );
}