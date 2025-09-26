import FeatureCard from '../components/FeatureCard';
import SearchBox from '../components/SearchBox';

const SITE_NAME = 'Seeres LoL Insights';
const DOMAINS = ['https://www.seeres.info', 'https://lol.seeres.info'];
const LAST_UPDATED = '2025-09-26';

const core = [
    { key: 'patch-champ-impact', title: '패치별 챔피언 영향도', desc: '픽/밴/승률 변화와 신뢰구간' },
    { key: 'ban-pick', title: '밴/픽률 분석 (지역/티어/라인)', desc: 'KR/NA/EUW/브라질 + 티어/라인 필터' },
    { key: 'winrate', title: '승률 트렌드', desc: '패치 타임라인으로 변동 추적' },
    { key: 'item-impact', title: '아이템 패치 영향도', desc: '변경/추가/삭제 아이템 성능 영향' },
    { key: 'item-build-order', title: '아이템 빌드 순서·타이밍', desc: '코어템 타이밍 비교' },
    { key: 'role-filter', title: '포지션/라인 필터', desc: 'TOP/JNG/MID/ADC/SUP' },
];

const adv = [
    { key: 'meta-shift', title: '메타 시프트 탐지', desc: '급상승/급하락 자동 감지' },
    { key: 'hotfix', title: '핫픽스 감지', desc: '서브버전 급변 지점 표시' },
    { key: 'timeline-events', title: '타임라인 이벤트 분석', desc: '첫 귀환/코어템/오브젝트 타이밍' },
    { key: 'objectives', title: '오브젝트 상관', desc: '드래곤/전령/바론 vs 승률' },
    { key: 'region-compare', title: '지역 간 비교', desc: 'KR↔NA↔EUW 비교' },
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