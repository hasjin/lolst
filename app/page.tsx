import FeatureCard from '../components/FeatureCard';
import SearchBox from '../components/SearchBox';

const SITE_NAME = 'Seeres LoL Insights';
const DOMAINS = ['https://www.seeres.info', 'https://lol.seeres.info'];
const LAST_UPDATED = '2025-09-26';

const core = [
    { key: "patch-champ-impact", title: "패치별 챔피언 영향도", desc: "전/후 패치 대비 픽률·밴률·승률 변화와 신뢰구간" },
    { key: "ban-pick", title: "밴/픽률 분석 (지역/티어/라인)", desc: "KR/NA/EUW/브라질 등 주요 지역 + 티어·라인 필터" },
    { key: "winrate", title: "승률 트렌드", desc: "패치 타임라인으로 챔피언 승률 변동 추적" },
    { key: "item-impact", title: "아이템 패치 영향도", desc: "변경/추가/삭제 아이템이 성능에 미친 영향" },
    { key: "item-build-order", title: "아이템 빌드 순서·타이밍", desc: "코어템 타이밍(분/초), 빌드 경로별 승률 비교" },
    { key: "role-filter", title: "포지션/라인 필터", desc: "TOP/JNG/MID/ADC/SUP 별 분해" },
    { key: "tier-filter", title: "티어 분해", desc: "Gold~Challenger 별 성능 차이" },
    { key: "queue-type", title: "큐 타입 비교", desc: "솔로랭크(420) / 자유랭크(440) / ARAM" },
    { key: "ban-phase", title: "밴 단계 분석", desc: "1밴/2밴/타겟밴 비중과 승률 상관" },
    { key: "synergy-counter", title: "시너지/카운터", desc: "듀오·상대 상성 매트릭스" },
];

const adv = [
    { key: "meta-shift", title: "메타 시프트 탐지", desc: "전/후 패치 자동 감지(급상승/급하락 챔피언)" },
    { key: "hotfix", title: "핫픽스 감지", desc: "서브버전(Hotfix) 반영 시 급변 지점 표시" },
    { key: "timeline-events", title: "타임라인 이벤트 분석", desc: "첫 귀환/첫 코어템/오브젝트 타이밍과 승률" },
    { key: "objectives", title: "오브젝트 상관", desc: "드래곤/전령/바론 컨트롤과 경기 결과" },
    { key: "game-length", title: "게임 길이 구간", desc: "20/25/30+ 분 구간별 챔피언 성능" },
    { key: "lead-curve", title: "초반 리드 → 승률 커브", desc: "10/15분 골드 격차 vs 최종 승률" },
    { key: "position-shift", title: "포지션 변동/스왑", desc: "비정형 포지션에서의 성능" },
    { key: "region-compare", title: "지역 간 비교", desc: "KR↔NA↔EUW 등 교차 비교" },
    { key: "runes-summoners", title: "룬/소환사 주문 영향", desc: "세팅별 성능 분해" },
    { key: "build-recommender", title: "추천 빌드/룬 생성기", desc: "메타 기반 조합 추천" },
    { key: "ban-recommender", title: "밴 추천", desc: "상대 퍼스트픽·조합 기반 밴 후보" },
    { key: "ddragon-diff", title: "아이템/챔피언 Diff 뷰어", desc: "DDragon 버전 간 변경점 비교" },
    { key: "multi-patch-report", title: "버전 비교 리포트", desc: "n개 패치 연속 추세 요약" },
    { key: "outlier", title: "이상치 탐지", desc: "너프/버프 과다 후보 자동 플래그" },
];

export default function Page() {
    return (
        <main className="container">
            <header className="hero">
                <div className="badge">Beta</div>
                <h1>{SITE_NAME}</h1>
                <p className="subtitle">
                    패치 전후 <b>챔피언/아이템</b> 메타 변화를 한눈에.<br />
                    지역/티어/라인까지 정교하게 분해합니다.
                </p>
                <div className="domains">
                    {DOMAINS.map((d) => <span key={d} className="domain">{d}</span>)}
                </div>

                {/* 검색만 클라이언트 컴포넌트 */}
                <SearchBox />

                <div className="meta">Last updated: {LAST_UPDATED}</div>
            </header>

            <section className="section">
                <div className="section-head">
                    <h2>핵심 기능</h2>
                    <p>카드를 클릭하면 알림이 뜹니다(개발 예정).</p>
                </div>
                <ul className="grid">
                    {core.map((f) => (
                        <li key={f.key} className="card">
                            <FeatureCard variant="Core" title={f.title} desc={f.desc} />
                        </li>
                    ))}
                </ul>
            </section>

            <section className="section">
                <div className="section-head">
                    <h2>확장 기능</h2>
                    <p>수집 데이터로 확장 가능한 기능들입니다.</p>
                </div>
                <ul className="grid">
                    {adv.map((f) => (
                        <li key={f.key} className="card">
                            <FeatureCard variant="Pro" title={f.title} desc={f.desc} />
                        </li>
                    ))}
                </ul>
            </section>

            <footer className="footer">
                <div className="left">
                    <a href="/tos">이용약관</a><span> · </span><a href="/privacy">개인정보 처리방침</a>
                </div>
                <div className="right">
                    <span className="riot">본 서비스는 Riot Games와 무관합니다.</span>
                </div>
            </footer>
        </main>
    );
}