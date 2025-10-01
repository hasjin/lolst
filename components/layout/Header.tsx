/**
 * 헤더 컴포넌트
 *
 * 역할:
 * - 사이트 상단에 고정된 헤더 표시
 * - 브랜드 로고, 검색창, 언어 전환 버튼, 모바일 네비게이션 포함
 *
 * 레이아웃:
 * - 데스크톱: 3열 그리드 (브랜드 | 검색창 | 언어 전환)
 * - 모바일: 2행 레이아웃 (햄버거 메뉴 + 브랜드 + 언어 전환 / 검색창)
 *
 * 수정 가이드:
 * - 헤더 구조 변경: 아래 JSX 수정
 * - 헤더 스타일 변경: app/styles/layout.css의 .hdr 클래스 수정
 * - 사이트명 변경: lib/site.ts의 SITE_NAME 상수 수정
 */

'use client';

import Link from 'next/link';
import SearchBox from '@/components/SearchBox';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { SITE_NAME } from '@/lib/site';
import MobileNav from "@/components/layout/MobileNav";

export default function Head() {
    return (
        <header className="hdr">
            {/* 좌측: 브랜드 로고 (홈 링크) */}
            <div className="hdr__left">
                <Link href="/" className="brand">{SITE_NAME}</Link>
            </div>

            {/* 중앙: 검색창 */}
            <div className="hdr__center">
                <SearchBox />
            </div>

            {/* 우측: 언어 전환 버튼 */}
            <div className="hdr__right">
                <LanguageSwitcher />
            </div>

            {/* 모바일 네비게이션: 햄버거 메뉴 + 사이드바 토글 */}
            <MobileNav />
        </header>
    );
}