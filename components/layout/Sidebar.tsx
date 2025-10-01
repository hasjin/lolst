/**
 * 사이드바 네비게이션 컴포넌트
 *
 * 역할:
 * - 좌측 사이드바에 네비게이션 메뉴 표시
 * - "핵심 리포트"와 "고급 분석" 두 그룹으로 구성
 * - 각 그룹은 접기/펼치기 가능 (상태는 localStorage에 저장)
 * - "지원 예정" 메뉴는 비활성화 (회색 처리, 클릭 불가)
 * - 현재 페이지에 해당하는 메뉴 항목 하이라이트
 *
 * 데이터 소스:
 * - lib/nav.ts의 coreNav (핵심 리포트)
 * - lib/nav.ts의 proNav (고급 분석)
 *
 * 수정 가이드:
 * - 메뉴 항목 추가/수정: lib/nav.ts 파일 수정
 * - 사이드바 스타일 변경: app/styles/layout.css의 .lnb 클래스 수정
 * - 모바일 사이드바 동작: components/layout/MobileNav.tsx 참고
 */

'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Trans } from '@/components/i18n';
import { coreNav, proNav } from '@/lib/nav';

export default function Sidebar() {
    // 현재 경로 가져오기 (활성 메뉴 판단용)
    const pathname = usePathname();

    // 각 네비게이션 그룹의 접기/펼치기 상태 관리
    const [openCore, setOpenCore] = useState(true);  // 핵심 리포트 그룹
    const [openPro, setOpenPro]   = useState(true);  // 고급 분석 그룹

    // 마운트 시 localStorage에서 이전 상태 복원
    useEffect(() => {
        const c = localStorage.getItem('lnb.core');
        const p = localStorage.getItem('lnb.pro');
        if (c !== null) setOpenCore(c === '1');
        if (p !== null) setOpenPro(p === '1');
    }, []);

    // 상태 변경 시 localStorage에 저장 (사용자 선호도 유지)
    useEffect(() => { localStorage.setItem('lnb.core', openCore ? '1' : '0'); }, [openCore]);
    useEffect(() => { localStorage.setItem('lnb.pro',  openPro  ? '1' : '0'); }, [openPro]);

    // 현재 경로와 메뉴 href가 일치하는지 확인하는 함수
    const isActive = (href: string) => {
        if (!href || href === '#') return false;
        return pathname === href || pathname.startsWith(href + '/');
    };

    return (
        <nav id="app-sidebar" data-app-sidebar className="lnb" aria-label="Primary">
            {/* 핵심 리포트 그룹 */}
            <div className="lnb__group" data-open={openCore} aria-expanded={openCore}>
                {/* 그룹 헤더: 클릭 시 접기/펼치기 */}
                <button type="button" className="lnb__groupHead" onClick={() => setOpenCore(v => !v)}>
                    <span className="lnb__groupTitle">
                        <span suppressHydrationWarning><Trans ko="핵심 리포트" en="Core" /></span>
                    </span>
                    {/* 펼침/접힘 화살표 아이콘 */}
                    <span className="lnb__chev">▾</span>
                </button>

                {/* 그룹이 열린 경우 메뉴 항목 리스트 표시 */}
                {openCore && (
                    <ul className="lnb__list">
                        {coreNav.map(it => {
                            const active = !it.planned && isActive(it.href);
                            return (
                                <li key={it.key}>
                                    <Link
                                        className={`lnb__link ${active ? 'is-active' : ''}`}
                                        href={it.planned ? '#' : it.href}  // 지원 예정은 # 링크로
                                        aria-disabled={it.planned}  // 접근성: 비활성화 상태 표시
                                        aria-current={active ? 'page' : undefined}  // 현재 페이지 표시
                                        prefetch={false}
                                        onClick={(e) => { if (it.planned) e.preventDefault(); }}  // 지원 예정은 클릭 방지
                                    >
                                        {/* 메뉴 라벨 (다국어) */}
                                        <span className="lnb__label">
                                            <Trans ko={it.ko} en={it.en} />
                                        </span>

                                        {/* 뱃지 영역: "지원 예정" 표시 */}
                                        <span className="lnb__pills">
                                            {it.planned &&
                                                <span className="lnb__pill lnb__pill--muted">
                                                    <Trans ko="지원 예정" en="Planned" />
                                                </span>
                                            }
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* 고급 분석 그룹 (Pro) */}
            <div className="lnb__group" data-open={openPro} aria-expanded={openPro}>
                {/* 그룹 헤더: 클릭 시 접기/펼치기 */}
                <button type="button" className="lnb__groupHead" onClick={() => setOpenPro(v => !v)}>
                    <span className="lnb__groupTitle">
                        <span suppressHydrationWarning><Trans ko="고급 분석" en="Advanced" /></span>
                    </span>
                    {/* 펼침/접힘 화살표 아이콘 */}
                    <span className="lnb__chev">▾</span>
                </button>

                {/* 그룹이 열린 경우 메뉴 항목 리스트 표시 */}
                {openPro && (
                    <ul className="lnb__list">
                        {proNav.map(it => {
                            const active = !it.planned && isActive(it.href);
                            return (
                                <li key={it.key}>
                                    <Link
                                        className={`lnb__link ${active ? 'is-active' : ''}`}
                                        href={it.planned ? '#' : it.href}  // 지원 예정은 # 링크로
                                        aria-disabled={it.planned}  // 접근성: 비활성화 상태 표시
                                        aria-current={active ? 'page' : undefined}  // 현재 페이지 표시
                                        prefetch={false}
                                        onClick={(e) => { if (it.planned) e.preventDefault(); }}  // 지원 예정은 클릭 방지
                                    >
                                        {/* 메뉴 라벨 (다국어) */}
                                        <span className="lnb__label">
                                            <Trans ko={it.ko} en={it.en} />
                                        </span>

                                        {/* 뱃지 영역: "Pro" + "지원 예정" 표시 */}
                                        <span className="lnb__pills">
                                            {/* Pro 뱃지는 항상 표시 */}
                                            <span className="lnb__pill">Pro</span>

                                            {/* 지원 예정 뱃지는 조건부 표시 */}
                                            {it.planned &&
                                                <span className="lnb__pill lnb__pill--muted">
                                                    <Trans ko="지원 예정" en="Planned" />
                                                </span>
                                            }
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </nav>
    );
}