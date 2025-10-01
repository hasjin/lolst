/**
 * 홈페이지 컴포넌트
 *
 * 역할:
 * - 메인 Hero 섹션 표시 (사이트 소개, Beta 뱃지, 최신 갱신일)
 * - HomeSections 컴포넌트를 통해 핵심 리포트 및 고급 분석 카드 그리드 렌더링
 *
 * 수정 가이드:
 * - Hero 섹션 텍스트 변경: 아래 JSX의 Trans 컴포넌트 내용 수정
 * - 최신 갱신일 변경: LAST_UPDATED 상수 수정
 * - 카드 목록 변경: lib/nav.ts 파일의 coreNav, proNav 배열 수정
 */

import HomeSections from '@/components/HomeSections';
import { Trans } from '@/components/i18n';

// 사이트명 상수
const SITE_NAME = 'Seeres LoL Insights';
// 최신 갱신일 (수동 업데이트 필요)
const LAST_UPDATED = '2025-09-26';

export default function Page() {
    return (
        <>
            {/* Hero 섹션: 메인 페이지 상단 소개 영역 */}
            <section className="hero">
                {/* Beta 뱃지 */}
                <div className="badge">Beta</div>

                {/* 사이트 제목 */}
                <h1>{SITE_NAME}</h1>

                {/* 부제: 다국어 지원 */}
                <p className="subtitle">
                    <Trans
                        ko={<>패치 전후 <b>챔피언/아이템</b> 메타 변화를 한눈에. 지역/티어/라인까지 정교하게 분해합니다.</>}
                        en={<>See <b>champion/item</b> meta changes before/after patches. Filter by region, tier, and role.</>}
                    />
                </p>

                {/* 최신 갱신일 표시 */}
                <div className="meta">
                    <Trans ko="최신 갱신일:" en="Last updated:" /> {LAST_UPDATED}
                </div>
            </section>

            {/* 기능 카드 섹션 (핵심 리포트 + 고급 분석) */}
            <HomeSections />
        </>
    );
}