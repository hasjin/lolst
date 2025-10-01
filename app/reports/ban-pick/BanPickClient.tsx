/**
 * 밴픽 분석 클라이언트 컴포넌트
 *
 * 역할:
 * - 지역/티어/라인 필터링 UI 제공
 * - 챔피언 검색 기능
 * - 정렬 기능 (픽률, 밴률, 승률, 게임 수)
 * - 모바일: 필터 패널 토글 + 리스트 뷰
 * - PC: 상단 필터 바 + 테이블 뷰
 */

'use client';

import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Trans, useI18n } from '@/components/i18n';
import type { BanPickAnalysisRow } from '@/lib/types/reports';

// 한글 초성 추출 함수
function toInitials(s: string): string {
    const CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
    let out = '';
    for (const ch of s) {
        const code = ch.codePointAt(0)!;
        if (code >= 0xac00 && code <= 0xd7a3) {
            const idx = Math.floor((code - 0xac00) / (21 * 28));
            out += CHO[idx] ?? ch;
        } else {
            out += ch;
        }
    }
    return out;
}

const norm = (s: string) => s.normalize('NFKD').toLowerCase();

type L10n = { ko: string; en: string; key?: string | null };

type Props = {
    patch: string;
    queue: number;
    region: string;
    tier: string;
    role: string;
    rows: BanPickAnalysisRow[];
    champMap: ReadonlyArray<readonly [number, Readonly<L10n>]>;
};

// Data Dragon CDN URLs
const DD_VERSION = '15.1.1';
const getChampionIconUrl = (championKey: string) =>
    `https://ddragon.leagueoflegends.com/cdn/${DD_VERSION}/img/champion/${championKey}.png`;

// 지역 옵션
const REGIONS = [
    { value: 'all', ko: '전체 지역', en: 'All Regions' },
    { value: 'kr', ko: '한국', en: 'Korea' },
    { value: 'na', ko: '북미', en: 'North America' },
    { value: 'euw', ko: '서유럽', en: 'EU West' },
    { value: 'eune', ko: '동유럽', en: 'EU Nordic & East' },
    { value: 'br', ko: '브라질', en: 'Brazil' },
    { value: 'jp', ko: '일본', en: 'Japan' },
    { value: 'lan', ko: '라틴아메리카 북부', en: 'Latin America North' },
    { value: 'las', ko: '라틴아메리카 남부', en: 'Latin America South' },
    { value: 'oce', ko: '오세아니아', en: 'Oceania' },
    { value: 'ru', ko: '러시아', en: 'Russia' },
    { value: 'tr', ko: '터키', en: 'Turkey' },
];

// 티어 옵션
const TIERS = [
    { value: 'all', ko: '전체 티어', en: 'All Tiers' },
    { value: 'IRON', ko: '아이언', en: 'Iron' },
    { value: 'BRONZE', ko: '브론즈', en: 'Bronze' },
    { value: 'SILVER', ko: '실버', en: 'Silver' },
    { value: 'GOLD', ko: '골드', en: 'Gold' },
    { value: 'PLATINUM', ko: '플래티넘', en: 'Platinum' },
    { value: 'EMERALD', ko: '에메랄드', en: 'Emerald' },
    { value: 'DIAMOND', ko: '다이아몬드', en: 'Diamond' },
    { value: 'MASTER', ko: '마스터', en: 'Master' },
    { value: 'GRANDMASTER', ko: '그랜드마스터', en: 'Grandmaster' },
    { value: 'CHALLENGER', ko: '챌린저', en: 'Challenger' },
];

// 라인 옵션
const ROLES = [
    { value: 'all', ko: '전체 라인', en: 'All Roles' },
    { value: 'TOP', ko: '탑', en: 'Top' },
    { value: 'JUNGLE', ko: '정글', en: 'Jungle' },
    { value: 'MIDDLE', ko: '미드', en: 'Mid' },
    { value: 'BOTTOM', ko: '원딜', en: 'ADC' },
    { value: 'UTILITY', ko: '서포터', en: 'Support' },
];

// 정렬 옵션
const SORT_OPTIONS = [
    { value: 'pickRate', ko: '픽률', en: 'Pick Rate' },
    { value: 'banRate', ko: '밴률', en: 'Ban Rate' },
    { value: 'winRate', ko: '승률', en: 'Win Rate' },
    { value: 'games', ko: '게임 수', en: 'Games' },
];

const Q: Record<number, L10n> = {
    420: { ko: '솔로/듀오 랭크', en: 'Ranked Solo/Duo' },
    430: { ko: '일반 (비랭크)', en: 'Normal' },
    440: { ko: '자유 랭크', en: 'Ranked Flex' },
    450: { ko: '칼바람나락', en: 'ARAM' },
};

const queueLabel = (q: number, lang: 'ko' | 'en') =>
    (Q[q] ?? { ko: `큐 ${q}`, en: `Queue ${q}` })[lang];

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;

export default function BanPickClient({ patch, queue, region, tier, role, rows, champMap }: Props) {
    const { lang } = useI18n();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState<'pickRate' | 'banRate' | 'winRate' | 'games'>('pickRate');
    const [showFilters, setShowFilters] = useState(false); // 모바일 필터 패널 표시 여부

    const nameMap = useMemo(() => new Map<number, Readonly<L10n>>(champMap), [champMap]);

    const champName = (id: number): string => {
        const name = nameMap.get(id) ?? { ko: String(id), en: String(id) };
        return name[lang];
    };

    // 필터 변경 시 URL 업데이트
    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set(key, value);
        router.push(`?${params.toString()}`);
    };

    // 검색 필터링
    const filtered = useMemo(() => {
        const q = norm(query.trim());
        if (!q) return rows;

        const qInit = toInitials(q);
        return rows.filter(r => {
            const nm = nameMap.get(r.championId);
            if (!nm) return false;

            const ko = norm(nm.ko || '');
            const en = norm(nm.en || '');
            const koInit = norm(toInitials(nm.ko || ''));

            return ko.includes(q) || en.includes(q) || (qInit && koInit.includes(qInit));
        });
    }, [rows, query, nameMap]);

    // 정렬
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const valA = a[sortBy];
            const valB = b[sortBy];
            return valB - valA; // 내림차순
        });
    }, [filtered, sortBy]);

    return (
        <div className="banPickWrap">
            {/* 헤더 */}
            <div className="reportHead">
                <div>
                    <h1 className="reportTitle">
                        <Trans ko="밴/픽률 분석" en="Ban/Pick Analysis" />
                    </h1>
                    <p className="reportSub">
                        {patch} · {queueLabel(queue, lang)}
                    </p>
                </div>

                {/* 모바일 필터 토글 버튼 */}
                <button
                    type="button"
                    className="filterToggleBtn"
                    onClick={() => setShowFilters(v => !v)}
                >
                    <span className="filterIcon">⚙</span>
                    <Trans ko="필터" en="Filters" />
                    {showFilters ? ' ▲' : ' ▼'}
                </button>
            </div>

            {/* 필터 패널 */}
            <div className={`filterPanel ${showFilters ? 'is-open' : ''}`}>
                <div className="filterGrid">
                    {/* 지역 */}
                    <div className="filterGroup">
                        <label className="filterLabel">
                            <Trans ko="지역" en="Region" />
                        </label>
                        <select
                            className="filterSelect"
                            value={region}
                            onChange={(e) => updateFilter('region', e.target.value)}
                        >
                            {REGIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {lang === 'ko' ? opt.ko : opt.en}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 티어 */}
                    <div className="filterGroup">
                        <label className="filterLabel">
                            <Trans ko="티어" en="Tier" />
                        </label>
                        <select
                            className="filterSelect"
                            value={tier}
                            onChange={(e) => updateFilter('tier', e.target.value)}
                        >
                            {TIERS.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {lang === 'ko' ? opt.ko : opt.en}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 라인 */}
                    <div className="filterGroup">
                        <label className="filterLabel">
                            <Trans ko="라인" en="Role" />
                        </label>
                        <select
                            className="filterSelect"
                            value={role}
                            onChange={(e) => updateFilter('role', e.target.value)}
                        >
                            {ROLES.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {lang === 'ko' ? opt.ko : opt.en}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 정렬 */}
                    <div className="filterGroup">
                        <label className="filterLabel">
                            <Trans ko="정렬" en="Sort By" />
                        </label>
                        <select
                            className="filterSelect"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {lang === 'ko' ? opt.ko : opt.en}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 검색창 */}
                <div className="filterSearch">
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={lang === 'ko' ? '챔피언 검색 (예: ㅇㄹㄹ / ahri)' : 'Search champion...'}
                        className="filterInput"
                    />
                </div>
            </div>

            {/* 결과 테이블/리스트 */}
            <div className="banPickTable">
                {/* PC: 테이블 헤더 */}
                <div className="tableHeader">
                    <div className="thChamp"><Trans ko="챔피언" en="Champion" /></div>
                    <div className="thStat"><Trans ko="게임 수" en="Games" /></div>
                    <div className="thStat"><Trans ko="승률" en="Win Rate" /></div>
                    <div className="thStat"><Trans ko="픽률" en="Pick Rate" /></div>
                    <div className="thStat"><Trans ko="밴률" en="Ban Rate" /></div>
                </div>

                {/* 데이터 행 */}
                {sorted.length === 0 ? (
                    <div className="empty">
                        <Trans ko="검색 결과가 없습니다." en="No results found." />
                    </div>
                ) : (
                    <div className="tableBody">
                        {sorted.map(row => {
                            const wr = row.winRate;
                            const pr = row.pickRate;
                            const br = row.banRate;
                            const championKey = nameMap.get(row.championId)?.key;

                            return (
                                <div key={row.championId} className="tableRow">
                                    <div className="tdChamp">
                                        <span className="champInfo">
                                            {championKey && (
                                                <img
                                                    src={getChampionIconUrl(championKey)}
                                                    alt={champName(row.championId)}
                                                    className="champIcon"
                                                />
                                            )}
                                            <span className="champName">{champName(row.championId)}</span>
                                        </span>
                                    </div>
                                    <div className="tdStat">
                                        <span className="mobileLabel"><Trans ko="게임 수" en="Games" />: </span>
                                        {row.games.toLocaleString()}
                                    </div>
                                    <div className="tdStat">
                                        <span className="mobileLabel"><Trans ko="승률" en="Win Rate" />: </span>
                                        <span className={wr >= 0.52 ? 'high' : wr <= 0.48 ? 'low' : ''}>
                                            {pct(wr)}
                                        </span>
                                    </div>
                                    <div className="tdStat">
                                        <span className="mobileLabel"><Trans ko="픽률" en="Pick Rate" />: </span>
                                        {pct(pr)}
                                    </div>
                                    <div className="tdStat">
                                        <span className="mobileLabel"><Trans ko="밴률" en="Ban Rate" />: </span>
                                        {pct(br)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
