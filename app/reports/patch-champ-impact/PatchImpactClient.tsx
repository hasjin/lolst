'use client';

import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Trans, useI18n } from '@/components/i18n';
import type { PatchChampImpactRow } from '@/lib/types/reports';


const TREND_POINTS = 30;

function toInitials(s: string): string {
    const CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    let out = '';
    for (const ch of s) {
        const code = ch.codePointAt(0);
        if (code && code >= 0xac00 && code <= 0xd7a3) {
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
type TrendPt = { patch: string; games: number; wins: number; winRate: number; pickRate: number };

type Props = {
    patch: string;
    queue: number;
    baseline: string;
    region?: string;
    tier?: string;
    role?: string;
    rows: PatchChampImpactRow[];
    champMap: ReadonlyArray<readonly [number, Readonly<L10n>]>;
};

// Data Dragon CDN URLs
const DD_VERSION = '15.1.1';
const getChampionIconUrl = (championKey: string) =>
    `https://ddragon.leagueoflegends.com/cdn/${DD_VERSION}/img/champion/${championKey}.png`;
const getChampionSplashUrl = (championKey: string) =>
    `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championKey}_0.jpg`;

type RowWithScore = PatchChampImpactRow & { score: number };

const Q: Record<number, L10n> = {
    420: { ko: '솔로/듀오 랭크', en: 'Ranked Solo/Duo' },
    430: { ko: '일반 (비랭크)', en: 'Normal (Blind/Draft)' },
    440: { ko: '자유 랭크', en: 'Ranked Flex' },
    450: { ko: '칼바람나락', en: 'ARAM' },
};
const queueLabel = (q: number, lang: 'ko' | 'en') =>
    (Q[q] ?? { ko: `큐 ${q}`, en: `Queue ${q}` })[lang];

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

// 베이스라인 옵션
const BASELINES = [
    { value: 'prev', ko: '이전 패치', en: 'Previous Patch' },
    { value: 'prev-2', ko: '2개 패치 전', en: '2 Patches Ago' },
    { value: 'prev-3', ko: '3개 패치 전', en: '3 Patches Ago' },
];

function Sparkline({
    data,
    labels,
    h = 180,
    stroke = '#7dd3fc',
}: {
    data: number[];
    labels: string[];
    h?: number;
    stroke?: string;
}) {
    if (!data.length) return null;

    const padL = 42;
    const padR = 10;
    const padT = 12;
    const padB = 28; // x축 라벨 공간

    const n = data.length;
    const wCore = Math.max(360, (n - 1) * 70);
    const W = padL + wCore + padR;
    const H = h;

    let min = Math.min(...data);
    let max = Math.max(...data);
    if (min === max) {
        min -= 0.01;
        max += 0.01;
    }
    const span = max - min;
    const yOf = (v: number) => padT + (H - padT - padB) * (1 - (v - min) / span);
    const step = (n > 1 ? wCore / (n - 1) : wCore);

    const pts = data.map((v, i) => `${padL + i * step},${yOf(v)}`).join(' ');
    const yTicks = Array.from({ length: 6 }, (_, i) => min + (span * i) / 5);
    const fmtPct = (v: number) => `${(v * 100).toFixed(2)}%`;

    const [hover, setHover] = React.useState<{ i: number; x: number; y: number } | null>(null);
    const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = e.currentTarget as SVGSVGElement;
        const box = svg.getBoundingClientRect();

        // 실제 화면 좌표를 SVG viewBox 좌표로 변환
        const mouseX = e.clientX - box.left;
        const scaleX = W / box.width; // viewBox 너비 / 실제 렌더링 너비
        const svgX = mouseX * scaleX;

        // SVG 좌표계에서 데이터 인덱스 계산
        const rel = Math.max(padL, Math.min(W - padR, svgX)) - padL;
        const i = Math.round(rel / step);
        const idx = Math.max(0, Math.min(n - 1, i));
        setHover({ i: idx, x: padL + idx * step, y: yOf(data[idx]) });
    };

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            height={H}
            style={{ display: 'block' }}
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
        >
            {/* 배경 히트 영역 (마우스 이벤트 보장) */}
            <rect x={0} y={0} width={W} height={H} fill="transparent" />

            {/* y 그리드 */}
            {yTicks.map((yv, idx) => {
                const y = yOf(yv);
                return (
                    <g key={`gy-${idx}`} className="chart-grid">
                        <line x1={padL} y1={y} x2={W - padR} y2={y} className="chart-grid-line" strokeWidth={1} />
                        <text x={padL - 6} y={y + 3} textAnchor="end" fontSize="10" className="chart-label">
                            {fmtPct(yv)}
                        </text>
                    </g>
                );
            })}

            {/* 세로 그리드 + x 라벨 */}
            {data.map((_, i) => {
                const x = padL + i * step;
                return (
                    <g key={`vx-${i}`} className="chart-grid">
                        <line x1={x} y1={padT} x2={x} y2={H - padB} className="chart-grid-line-v" strokeWidth={1} />
                    </g>
                );
            })}
            {(() => {
                const maxTicks = Math.min(10, n);
                const skip = Math.max(1, Math.ceil(n / maxTicks));
                return labels.map((lb, i) => {
                    if (i % skip !== 0 && i !== n - 1) return null;
                    const x = padL + i * step;
                    return (
                        <text
                            key={`xl-${i}`}
                            x={x}
                            y={H - 8}
                            fontSize="10"
                            className="chart-label"
                            textAnchor="middle"
                            transform={`rotate(-28 ${x},${H - 8})`}
                        >
                            {lb}
                        </text>
                    );
                });
            })()}

            {/* 데이터 라인 */}
            <polyline
                fill="none"
                stroke={stroke}
                strokeWidth={2}
                points={pts}
                vectorEffect="non-scaling-stroke"
                className="chart-grid"
            />

            {/* 포커스 / 툴팁 */}
            {hover && (
                <g className="chart-grid">
                    <line x1={hover.x} y1={padT} x2={hover.x} y2={H - padB} className="chart-hover-line" strokeWidth={1} />
                    <circle cx={hover.x} cy={hover.y} r={3.5} fill={stroke} />
                    {(() => {
                        const i = hover.i;
                        const tip = `${labels[i] ?? ''}  ${fmtPct(data[i])}`;
                        const tx = Math.min(hover.x + 10, W - padR - 4);
                        const ty = Math.max(padT + 12, hover.y - 12);
                        const w = Math.max(48, tip.length * 6.2);
                        return (
                            <g transform={`translate(${tx},${ty})`}>
                                <rect x={-2} y={-12} rx={4} ry={4} width={w} height={18} className="chart-tooltip-bg" />
                                <text x={2} y={2} fontSize="11" className="chart-tooltip-text">{tip}</text>
                            </g>
                        );
                    })()}
                </g>
            )}
        </svg>
    );
}

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const delta = (v: number) => `${v > 0 ? '+' : ''}${(v * 100).toFixed(2)}%`;

export default function PatchImpactClient({ patch, queue, baseline, region, tier, role, rows, champMap }: Props) {
    const { lang } = useI18n();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState('');
    // 모바일용 탭 상태: 'list' | 'detail'
    const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
    const [showFilters, setShowFilters] = useState(false);

    // 필터 변경 시 URL 업데이트
    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        if (value === 'all') {
            params.delete(key); // 'all'인 경우 파라미터 제거
        } else {
            params.set(key, value);
        }
        router.push(`?${params.toString()}`);
    };

    const nameMap = useMemo(() => {
        const map = new Map<number, Readonly<L10n>>(champMap);
        // 디버깅: 첫 번째 챔피언 데이터 확인
        const first = champMap[0];
        if (first) {
            console.log('Champion data sample:', first);
        }
        return map;
    }, [champMap]);

    const rowsById = useMemo(() => new Map(rows.map(r => [r.championId, r])), [rows]);

    const changeOf = (r: PatchChampImpactRow) =>
        (r.dWinRate ?? 0) + (r.dPickRate ?? 0) + (r.dBanRate ?? 0);

    const sorted = useMemo(() => {
        const ids = champMap.map(([id]) => id);
        const full: RowWithScore[] = ids.map((id) => {
            const base = rowsById.get(id) ?? ({
                championId: id,
                winRate: 0,
                pickRate: 0,
                banRate: 0,
                dWinRate: 0,
                dPickRate: 0,
                dBanRate: 0,
            } as PatchChampImpactRow);
            const score = Math.abs(base.dWinRate ?? 0) + Math.abs(base.dPickRate ?? 0) + Math.abs(base.dBanRate ?? 0);
            return { ...(base as PatchChampImpactRow), score } as RowWithScore;
        });
        return full.sort((a, b) => changeOf(b) - changeOf(a));
    }, [champMap, rowsById, changeOf]);

    const [sel, setSel] = useState(sorted[0]?.championId ?? 0);
    useEffect(() => {
        if (!sorted.some((r) => r.championId === sel)) {
            setSel(sorted[0]?.championId ?? 0);
        }
    }, [sorted, sel]);

    const current = sorted.find((r) => r.championId === sel);

    const filtered = useMemo(() => {
        const q = norm(query.trim());
        if (!q) return sorted;

        const qInit = toInitials(q);
        return sorted.filter((r) => {
            const nm = nameMap.get(r.championId);
            if (!nm) return false;

            const ko = norm(nm.ko || '');
            const en = norm(nm.en || '');
            const koInit = norm(toInitials(nm.ko || ''));

            return (
                ko.includes(q) || en.includes(q) || (qInit && koInit.includes(qInit))
            );
        });
    }, [sorted, query, nameMap]);

    useEffect(() => {
        if (filtered.length && !filtered.some((r) => r.championId === sel)) {
            setSel(filtered[0].championId);
        }
    }, [filtered, sel]);

    const [trend, setTrend] = useState<TrendPt[] | null>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        let alive = true;
        setLoading(true);
        setTrend(null);
        (async () => {
            try {
                const res = await fetch(
                    `/api/internal/reports/champion-trend?championId=${sel}&queue=${queue}&upto=${encodeURIComponent(patch)}&n=${TREND_POINTS}`,
                    { cache: 'no-store' }
                );
                const data: TrendPt[] = await res.json();
                if (alive) setTrend([...data].reverse()); // 과거→현재
            } catch {
                if (alive) setTrend([]);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [sel, queue, patch]);

    const champName = (id: number): string => {
        const name = nameMap.get(id) ?? { ko: String(id), en: String(id) };
        return name[lang];
    };

    const prevPatchLabel = trend && trend.length > 1 ? trend[trend.length - 2].patch : 'prev';

    const dW = current?.dWinRate ?? 0;
    const dP = current?.dPickRate ?? 0;
    const dB = current?.dBanRate ?? 0;

    const prevW = (current?.winRate ?? 0) - dW;
    const prevP = (current?.pickRate ?? 0) - dP;
    const prevB = (current?.banRate ?? 0) - dB;

    return (
        <div className="patchImpactWrap">
            {/* 헤더 */}
            <div className="reportHead">
                <div>
                    <h1 className="reportTitle">
                        <Trans ko="패치별 챔피언 영향도" en="Champion Impact by Patch" />
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
                    {/* 베이스라인 */}
                    <div className="filterGroup">
                        <label className="filterLabel">
                            <Trans ko="비교 기준" en="Baseline" />
                        </label>
                        <select
                            className="filterSelect"
                            value={baseline}
                            onChange={(e) => updateFilter('baseline', e.target.value)}
                        >
                            {BASELINES.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {lang === 'ko' ? opt.ko : opt.en}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 지역 */}
                    <div className="filterGroup">
                        <label className="filterLabel">
                            <Trans ko="지역" en="Region" />
                        </label>
                        <select
                            className="filterSelect"
                            value={region || 'all'}
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
                            value={tier || 'all'}
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
                            value={role || 'all'}
                            onChange={(e) => updateFilter('role', e.target.value)}
                        >
                            {ROLES.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {lang === 'ko' ? opt.ko : opt.en}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="twoCol">
                {/* 모바일 탭 네비게이션 */}
                <div className="mobileTabs">
                    <button
                        type="button"
                        className={`mobileTab ${mobileView === 'list' ? 'is-active' : ''}`}
                        onClick={() => setMobileView('list')}
                    >
                        <Trans ko="챔피언 목록" en="Champion List" />
                    </button>
                    <button
                        type="button"
                        className={`mobileTab ${mobileView === 'detail' ? 'is-active' : ''}`}
                        onClick={() => setMobileView('detail')}
                        disabled={!current}
                    >
                        <Trans ko="상세 정보" en="Details" />
                        {current && <span className="mobileTabChamp">: {champName(current.championId)}</span>}
                    </button>
                </div>

            <aside className={`leftPane ${mobileView === 'list' ? 'is-mobile-visible' : ''}`}>
                <div className="searchWrapper">
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.currentTarget.value)}
                        placeholder="챔피언 검색 (예: ㅇㄹㄹ / ahri)"
                        aria-label="filter champions"
                        className="filterInput"
                    />
                </div>
                <div className="paneHead">
                    <h2><Trans ko="상위 변동" en="Top shifts" /></h2>
                    <div className="sub">{patch}, {queueLabel(queue, lang)}</div>
                </div>
                {filtered.length === 0 ? (
                    <div className="empty"><Trans ko="검색 결과가 없습니다." en="No matches." /></div>
                ) : (
                    <ul className="list" role="list">
                        {filtered.map((r) => {
                            const signedDelta = (r.dWinRate ?? 0) + (r.dPickRate ?? 0) + (r.dBanRate ?? 0);
                            const up = signedDelta >= 0;
                            const arrow = up ? '▲' : '▼';
                            const championKey = nameMap.get(r.championId)?.key;
                            return (
                                <li key={r.championId}>
                                    <button
                                        type="button"
                                        className={`rowBtn ${sel === r.championId ? 'is-active' : ''}`}
                                        onClick={() => {
                                            setSel(r.championId);
                                            // 모바일에서 챔피언 선택 시 상세 정보 탭으로 자동 전환
                                            setMobileView('detail');
                                        }}
                                    >
                                        <span className="champInfo">
                                            {championKey && (
                                                <img
                                                    src={getChampionIconUrl(championKey)}
                                                    alt={champName(r.championId)}
                                                    className="champIcon"
                                                />
                                            )}
                                            <span className="title">{champName(r.championId)}</span>
                                        </span>
                                        <span className={`delta ${up ? 'up' : 'down'}`}>
                                            {arrow} {Math.abs(signedDelta * 100).toFixed(2)}%
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </aside>

            <section className={`rightPane ${mobileView === 'detail' ? 'is-mobile-visible' : ''}`}>
                {current ? (
                    <>
                        {/* 모바일 뒤로 가기 버튼 */}
                        <button
                            type="button"
                            className="mobileBackBtn"
                            onClick={() => setMobileView('list')}
                        >
                            ← <Trans ko="목록으로" en="Back to list" />
                        </button>

                        {/* 챔피언 스플래시 아트 배경 */}
                        {(() => {
                            const championKey = nameMap.get(current.championId)?.key;
                            return championKey ? (
                                <div
                                    className="champSplash"
                                    style={{
                                        backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.95)), url(${getChampionSplashUrl(championKey)})`,
                                    }}
                                >
                                    <div className="paneHead">
                                        <h2>{champName(current.championId)}</h2>
                                        <div className="sub">
                                            {patch} · {queueLabel(queue, lang)}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="paneHead">
                                    <h2>{champName(current.championId)}</h2>
                                    <div className="sub">
                                        {patch} · {queueLabel(queue, lang)}
                                    </div>
                                </div>
                            );
                        })()}

                        <div className="statCard" aria-label="current stats">
                            <div className="statTitle"><Trans ko="현재 패치" en="Current patch" /> ({patch})</div>
                            <div className="statGrid">
                                <div><Trans ko="승률" en="Win%" /></div>
                                <div>
                                    <strong>{pct(current.winRate)}</strong>
                                    {' '}
                                    <small className={dW >= 0 ? 'up' : 'down'}>({delta(dW)})</small>
                                    {' '}
                                    <small className="muted-text">{prevPatchLabel} {pct(prevW)}</small>
                                </div>

                                <div><Trans ko="픽률" en="Pick%" /></div>
                                <div>
                                    <strong>{pct(current.pickRate)}</strong>
                                    {' '}
                                    <small className={dP >= 0 ? 'up' : 'down'}>({delta(dP)})</small>
                                    {' '}
                                    <small className="muted-text">{prevPatchLabel} {pct(prevP)}</small>
                                </div>

                                <div><Trans ko="밴률" en="Ban%" /></div>
                                <div>
                                    <strong>{pct(current.banRate)}</strong>
                                    {' '}
                                    <small className={dB >= 0 ? 'up' : 'down'}>({delta(dB)})</small>
                                    {' '}
                                    <small className="muted-text">{prevPatchLabel} {pct(prevB)}</small>
                                </div>
                            </div>
                        </div>

                        {/* 상세 통계 (게임 수, 승/패 수 등) */}
                        {(current.games || current.wins || current.bans) && (
                            <div className="statCard" aria-label="detailed stats">
                                <div className="statTitle"><Trans ko="상세 통계" en="Detailed Stats" /></div>
                                <div className="statGrid">
                                    {current.games !== undefined && (
                                        <>
                                            <div><Trans ko="게임 수" en="Games" /></div>
                                            <div><strong>{current.games.toLocaleString()}</strong></div>
                                        </>
                                    )}
                                    {current.wins !== undefined && (
                                        <>
                                            <div><Trans ko="승리 수" en="Wins" /></div>
                                            <div><strong>{current.wins.toLocaleString()}</strong></div>
                                        </>
                                    )}
                                    {current.games !== undefined && current.wins !== undefined && (
                                        <>
                                            <div><Trans ko="패배 수" en="Losses" /></div>
                                            <div><strong>{(current.games - current.wins).toLocaleString()}</strong></div>
                                        </>
                                    )}
                                    {current.bans !== undefined && (
                                        <>
                                            <div><Trans ko="밴 횟수" en="Bans" /></div>
                                            <div><strong>{current.bans.toLocaleString()}</strong></div>
                                        </>
                                    )}
                                    {current.games !== undefined && (
                                        <>
                                            <div><Trans ko="픽 횟수" en="Picks" /></div>
                                            <div><strong>{Math.round(current.games * (current.pickRate || 0)).toLocaleString()}</strong></div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 메타 분석 */}
                        <div className="statCard" aria-label="meta analysis">
                            <div className="statTitle"><Trans ko="메타 분석" en="Meta Analysis" /></div>
                            <div className="statGrid">
                                <div><Trans ko="인기도" en="Popularity" /></div>
                                <div>
                                    <strong>
                                        {current.pickRate >= 0.15 ? (
                                            <Trans ko="매우 높음" en="Very High" />
                                        ) : current.pickRate >= 0.10 ? (
                                            <Trans ko="높음" en="High" />
                                        ) : current.pickRate >= 0.05 ? (
                                            <Trans ko="보통" en="Medium" />
                                        ) : current.pickRate >= 0.02 ? (
                                            <Trans ko="낮음" en="Low" />
                                        ) : (
                                            <Trans ko="매우 낮음" en="Very Low" />
                                        )}
                                    </strong>
                                    {' '}
                                    <small className="muted-text">({pct(current.pickRate)})</small>
                                </div>

                                <div><Trans ko="밴 우선도" en="Ban Priority" /></div>
                                <div>
                                    <strong>
                                        {current.banRate >= 0.50 ? (
                                            <Trans ko="필밴" en="Must Ban" />
                                        ) : current.banRate >= 0.30 ? (
                                            <Trans ko="매우 높음" en="Very High" />
                                        ) : current.banRate >= 0.15 ? (
                                            <Trans ko="높음" en="High" />
                                        ) : current.banRate >= 0.05 ? (
                                            <Trans ko="보통" en="Medium" />
                                        ) : (
                                            <Trans ko="낮음" en="Low" />
                                        )}
                                    </strong>
                                    {' '}
                                    <small className="muted-text">({pct(current.banRate)})</small>
                                </div>

                                <div><Trans ko="티어 평가" en="Tier Rating" /></div>
                                <div>
                                    <strong>
                                        {current.winRate >= 0.54 ? (
                                            <span className="tier-splus">S+ Tier</span>
                                        ) : current.winRate >= 0.52 ? (
                                            <span className="tier-s">S Tier</span>
                                        ) : current.winRate >= 0.51 ? (
                                            <span className="tier-a">A Tier</span>
                                        ) : current.winRate >= 0.49 ? (
                                            <span className="tier-b">B Tier</span>
                                        ) : current.winRate >= 0.47 ? (
                                            <span className="tier-c">C Tier</span>
                                        ) : (
                                            <span className="tier-d">D Tier</span>
                                        )}
                                    </strong>
                                    {' '}
                                    <small className="muted-text">({pct(current.winRate)})</small>
                                </div>

                                <div><Trans ko="변화 추세" en="Trend" /></div>
                                <div>
                                    {(() => {
                                        const totalChange = Math.abs(dW) + Math.abs(dP) + Math.abs(dB);
                                        const isRising = (dW + dP + dB) > 0;
                                        return (
                                            <strong className={isRising ? 'up' : 'down'}>
                                                {totalChange >= 0.10 ? (
                                                    isRising ? <Trans ko="급상승" en="Rising Fast" /> : <Trans ko="급하락" en="Falling Fast" />
                                                ) : totalChange >= 0.05 ? (
                                                    isRising ? <Trans ko="상승세" en="Rising" /> : <Trans ko="하락세" en="Falling" />
                                                ) : totalChange >= 0.02 ? (
                                                    isRising ? <Trans ko="소폭 상승" en="Slight Rise" /> : <Trans ko="소폭 하락" en="Slight Fall" />
                                                ) : (
                                                    <Trans ko="안정" en="Stable" />
                                                )}
                                                {' '}
                                                <small className="muted-text">({delta(totalChange * (isRising ? 1 : -1))})</small>
                                            </strong>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* 신뢰 구간 정보 (있는 경우) */}
                        {(current.winRateCI || current.pickRateCI || current.banRateCI) && (
                            <div className="statCard" aria-label="confidence intervals">
                                <div className="statTitle"><Trans ko="신뢰 구간 (95%)" en="Confidence Intervals (95%)"/></div>
                                <div className="statGrid">
                                    {current.winRateCI && (
                                        <>
                                            <div><Trans ko="승률 범위" en="Win% Range"/></div>
                                            <div>
                                                <small>{pct(current.winRateCI[0])} ~ {pct(current.winRateCI[1])}</small>
                                            </div>
                                        </>
                                    )}
                                    {current.pickRateCI && (
                                        <>
                                            <div><Trans ko="픽률 범위" en="Pick% Range"/></div>
                                            <div>
                                                <small>{pct(current.pickRateCI[0])} ~ {pct(current.pickRateCI[1])}</small>
                                            </div>
                                        </>
                                    )}
                                    {current.banRateCI && (
                                        <>
                                            <div><Trans ko="밴률 범위" en="Ban% Range"/></div>
                                            <div>
                                                <small>{pct(current.banRateCI[0])} ~ {pct(current.banRateCI[1])}</small>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="chartWrap">
                            <div className="statTitle"><Trans ko="최근 추이 (패치별)" en="Recent trend (by patch)"/></div>
                            {loading && <div className="empty"><Trans ko="그래프 데이터를 불러오는 중…" en="Loading trend…"/></div>}
                            {!loading && trend && trend.length>0 && (
                                <>
                                    <div className="statTitle"><Trans ko="승률" en="Win rate"/></div>
                                    <Sparkline
                                        data={trend.map(t=>t.winRate)}
                                        labels={trend.map(t=>t.patch)}
                                        stroke="#7dd3fc"
                                    />
                                    <div className="statTitle statTitle--spaced"><Trans ko="픽률" en="Pick rate"/></div>
                                    <Sparkline
                                        data={trend.map(t=>t.pickRate)}
                                        labels={trend.map(t=>t.patch)}
                                        stroke="#a78bfa"
                                    />
                                </>
                            )}
                            {!loading && trend && trend.length===0 && <div className="empty"><Trans ko="데이터가 없습니다." en="No data."/></div>}
                        </div>
                    </>
                ) : (
                    <div className="empty"><Trans ko="데이터가 없습니다." en="No data."/></div>
                )}
            </section>
            </div>
        </div>
    );
}