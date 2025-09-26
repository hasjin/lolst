import FeatureCard from '@/components/FeatureCard';
import SearchBox from '@/components/SearchBox';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Trans } from '@/components/i18n';

const SITE_NAME = 'Seeres LoL Insights';
const DOMAINS = ['https://www.seeres.info', 'https://lol.seeres.info'];
const LAST_UPDATED = '2025-09-26';

// 각 아이템에 ko/en 문구 추가
const core = [
    { key: 'patch-champ-impact',
        titleKo: '패치별 챔피언 영향도', titleEn: 'Champion impact by patch',
        descKo: '전/후 패치 대비 픽률·밴률·승률 변화와 신뢰구간',
        descEn: 'Pick/ban/win-rate deltas with confidence intervals',
    },
    { key: 'ban-pick',
        titleKo: '밴/픽률 분석 (지역/티어/라인)', titleEn: 'Ban/Pick analysis (region/tier/role)',
        descKo: 'KR/NA/EUW/브라질 등 주요 지역 + 티어·라인 필터',
        descEn: 'KR/NA/EUW/BR and more with tier/role filters',
    },
    { key: 'winrate',
        titleKo: '승률 트렌드', titleEn: 'Win-rate trend',
        descKo: '패치 타임라인으로 챔피언 승률 변동 추적',
        descEn: 'Track win-rate changes across patch timeline',
    },
    { key: 'item-impact',
        titleKo: '아이템 패치 영향도', titleEn: 'Item patch impact',
        descKo: '변경/추가/삭제 아이템이 성능에 미친 영향',
        descEn: 'Effect of added/changed/removed items on performance',
    },
    { key: 'item-build-order',
        titleKo: '아이템 빌드 순서·타이밍', titleEn: 'Item build order & timings',
        descKo: '코어템 타이밍(분/초), 빌드 경로별 승률 비교',
        descEn: 'Core item timings and win-rate by build path',
    },
    { key: 'role-filter',
        titleKo: '포지션/라인 필터', titleEn: 'Role/Lane filter',
        descKo: 'TOP/JNG/MID/ADC/SUP 별 분해',
        descEn: 'Breakdown by TOP/JNG/MID/ADC/SUP',
    },
    { key: 'tier-filter',
        titleKo: '티어 분해', titleEn: 'Tier breakdown',
        descKo: 'Gold~Challenger 별 성능 차이',
        descEn: 'Performance by tier (Gold→Challenger)',
    },
    { key: 'queue-type',
        titleKo: '큐 타입 비교', titleEn: 'Queue type comparison',
        descKo: '솔로랭크(420) / 자유랭크(440) / ARAM',
        descEn: 'SoloQ(420) / Flex(440) / ARAM',
    },
    { key: 'ban-phase',
        titleKo: '밴 단계 분석', titleEn: 'Ban phase analysis',
        descKo: '1밴/2밴/타겟밴 비중과 승률 상관',
        descEn: 'Phase-1/2/target ban shares vs. win-rate',
    },
    { key: 'synergy-counter',
        titleKo: '시너지/카운터', titleEn: 'Synergy & counter',
        descKo: '듀오·상대 상성 매트릭스',
        descEn: 'Duo synergy and opponent matrix',
    },
];

const adv = [
    { key:'meta-shift', titleKo:'메타 시프트 탐지', titleEn:'Meta shift detection',
        descKo:'전/후 패치 자동 감지(급상승/급하락 챔피언)', descEn:'Auto-detect rises/falls across patches' },
    { key:'hotfix', titleKo:'핫픽스 감지', titleEn:'Hotfix detection',
        descKo:'서브버전(Hotfix) 반영 시 급변 지점 표시', descEn:'Mark sharp changes on hotfix sub-versions' },
    { key:'timeline-events', titleKo:'타임라인 이벤트 분석', titleEn:'Timeline event analysis',
        descKo:'첫 귀환/첫 코어템/오브젝트 타이밍과 승률', descEn:'First recall/core item/objective timings vs win' },
    { key:'objectives', titleKo:'오브젝트 상관', titleEn:'Objectives correlation',
        descKo:'드래곤/전령/바론 컨트롤과 경기 결과', descEn:'Dragon/Herald/Baron control vs outcome' },
    { key:'game-length', titleKo:'게임 길이 구간', titleEn:'Game length buckets',
        descKo:'20/25/30+ 분 구간별 챔피언 성능', descEn:'Performance by 20/25/30+ minute buckets' },
    { key:'lead-curve', titleKo:'초반 리드 → 승률 커브', titleEn:'Early lead → win curve',
        descKo:'10/15분 골드 격차 vs 최종 승률', descEn:'10/15-min gold diff vs final win' },
    { key:'position-shift', titleKo:'포지션 변동/스왑', titleEn:'Position shift/swap',
        descKo:'비정형 포지션에서의 성능', descEn:'Performance on off-roles/role swaps' },
    { key:'region-compare', titleKo:'지역 간 비교', titleEn:'Region comparison',
        descKo:'KR↔NA↔EUW 등 교차 비교', descEn:'Cross-compare KR/NA/EUW etc.' },
    { key:'runes-summoners', titleKo:'룬/소환사 주문 영향', titleEn:'Runes & summoners',
        descKo:'세팅별 성능 분해', descEn:'Performance by rune/summoner setups' },
    { key:'build-recommender', titleKo:'추천 빌드/룬 생성기', titleEn:'Build/rune recommender',
        descKo:'메타 기반 조합 추천', descEn:'Meta-based recommendations' },
    { key:'ban-recommender', titleKo:'밴 추천', titleEn:'Ban recommender',
        descKo:'상대 퍼스트픽·조합 기반 밴 후보', descEn:'Ban candidates vs enemy first-pick/comp' },
    { key:'ddragon-diff', titleKo:'아이템/챔피언 Diff 뷰어', titleEn:'Item/Champion diff viewer',
        descKo:'DDragon 버전 간 변경점 비교', descEn:'Compare DDragon versions' },
    { key:'multi-patch-report', titleKo:'버전 비교 리포트', titleEn:'Multi-patch report',
        descKo:'n개 패치 연속 추세 요약', descEn:'Summaries across n patches' },
    { key:'outlier', titleKo:'이상치 탐지', titleEn:'Outlier detection',
        descKo:'너프/버프 과다 후보 자동 플래그', descEn:'Auto-flag potential over/under-tuned' },
];

export default function Page() {
    return (
        <main className="container">
            <header className="hero">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div className="badge">Beta</div>
                    <LanguageSwitcher />
                </div>

                <h1>{SITE_NAME}</h1>

                <p className="subtitle">
                    <Trans
                        ko={<>패치 전후 <b>챔피언/아이템</b> 메타 변화를 한눈에.<br/>지역/티어/라인까지 정교하게 분해합니다.</>}
                        en={<>See <b>champion/item</b> meta changes before/after patches.<br/>Filter by region, tier, and role.</>}
                    />
                </p>

                <div className="domains">
                    {DOMAINS.map((d) => <span key={d} className="domain">{d}</span>)}
                </div>

                <SearchBox />
                <div className="meta">Last updated: {LAST_UPDATED}</div>
            </header>

            <section className="section">
                <div className="section-head">
                    <h2><Trans ko="핵심 리포트" en="Core Reports" /></h2>
                    <p>
                        <Trans
                            ko="패치 전후 메타를 빠르게 확인할 수 있는 기본 지표 모음입니다."
                            en="Essential reports to quickly inspect pre/post-patch meta shifts."
                        />
                    </p>
                </div>
                <ul className="grid">
                    {core.map((f) => (
                        <li key={f.key} className="card">
                            <FeatureCard
                                variant="Core"
                                title={<Trans ko={f.titleKo} en={f.titleEn} />}
                                desc={<Trans ko={f.descKo} en={f.descEn} />}
                            />
                        </li>
                    ))}
                </ul>
            </section>

            <section className="section">
                <div className="section-head">
                    <h2><Trans ko="고급 분석" en="Advanced Analytics" /></h2>
                    <p>
                        <Trans
                            ko="수집 데이터가 충분해지면 단계적으로 공개되는 심화 기능입니다."
                            en="Deeper analyses released progressively as more data is collected."
                        />
                    </p>
                </div>
                <ul className="grid">
                    {adv.map((f) => (
                        <li key={f.key} className="card">
                            <FeatureCard
                                variant="Pro"
                                title={<Trans ko={f.titleKo} en={f.titleEn} />}
                                desc={<Trans ko={f.descKo} en={f.descEn} />}
                            />
                        </li>
                    ))}
                </ul>
            </section>

            <footer className="footer">
                <div className="left">
                    <a href="/tos"><Trans ko="이용약관" en="Terms" /></a>
                    <span> · </span>
                    <a href="/privacy"><Trans ko="개인정보 처리방침" en="Privacy" /></a>
                </div>

                <div className="right">
                    <span className="riot">
                      <Trans ko="본 서비스는 Riot Games와 무관합니다." en="This service is not endorsed by Riot Games." />
                    </span>
                </div>

                <div className="copy">
                    <>© <span suppressHydrationWarning>{new Date().getFullYear()}</span> Seeres LoL Insights. All rights reserved.</>
                </div>
            </footer>
        </main>
    );
}