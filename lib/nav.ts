// 공용 타입(카드/사이드바가 같은 데이터 사용)
export type LocaleText = { ko: string; en: string };
export type NavItemFull = {
    key: string;
    href: string;
    label: LocaleText;          // 메뉴/카드 타이틀
    planned?: boolean;
    pro?: boolean;
    summary?: LocaleText;       // 카드 설명
};
export type NavSection = {
    id: 'core' | 'advanced';
    title: LocaleText;
    items: NavItemFull[];
};

// ====== 전체 네비(한 소스) ======
const coreItems: NavItemFull[] = [
    {
        key: 'patch-champ-impact',
        href: '/reports/patch-champ-impact',
        label: { ko: '패치별 챔피언 영향도', en: 'Champion impact by patch' },
        planned: false,
        summary: {
            ko: '전·후 패치 대비 픽률·밴률·승률 변화와 신뢰구간',
            en: 'Pick/ban/win-rate deltas with confidence intervals',
        },
    },
    {
        key: 'ban-pick',
        href: '/reports/ban-pick',
        label: { ko: '밴/픽률 분석 (지역/티어/라인)', en: 'Ban/Pick analysis (region/tier/role)' },
        planned: true,
        summary: {
            ko: '주요 지역을 티어·라인 필터로 세분 분석',
            en: 'Regions with tier/role filters',
        },
    },
    {
        key: 'winrate',
        href: '/reports/winrate',
        label: { ko: '승률 트렌드', en: 'Win-rate trend' },
        planned: true,
        summary: {
            ko: '패치 타임라인 기준 승률 변동 추적',
            en: 'Track win-rate changes across patches',
        },
    },
    {
        key: 'item-impact',
        href: '/reports/item-impact',
        label: { ko: '아이템 패치 영향도', en: 'Item patch impact' },
        planned: true,
        summary: {
            ko: '아이템 변경/추가/삭제가 성능에 미치는 영향',
            en: 'Effect of item changes on performance',
        },
    },
    {
        key: 'item-build-order',
        href: '/reports/item-build-order',
        label: { ko: '아이템 빌드 순서·타이밍', en: 'Item build order & timings' },
        pro: true,
        planned: true,
        summary: {
            ko: '코어템 타이밍과 빌드 경로별 승률',
            en: 'Core timings & win-rate by build path',
        },
    },
    {
        key: 'role-filter',
        href: '/reports/role-filter',
        label: { ko: '포지션/라인 필터', en: 'Role/Lane filter' },
        planned: true,
        summary: {
            ko: '포지션·라인별 주요 지표를 필터링',
            en: 'Filter key metrics by role and lane',
        },
    },
    {
        key: 'tier-filter',
        href: '/reports/tier-filter',
        label: { ko: '티어 분해', en: 'Tier breakdown' },
        planned: true,
        summary: {
            ko: '티어별로 픽·밴·승률 등 지표를 분해 비교',
            en: 'Break down metrics by tier',
        },
    },
    {
        key: 'queue-type',
        href: '/reports/queue-type',
        label: { ko: '큐 타입 비교', en: 'Queue type comparison' },
        planned: true,
        summary: {
            ko: '솔랭/자유랭 등 큐 타입 간 성능 비교',
            en: 'Compare performance across queue types',
        },
    },
    {
        key: 'ban-phase',
        href: '/reports/ban-phase',
        label: { ko: '밴 단계 분석', en: 'Ban phase analysis' },
        planned: true,
        summary: {
            ko: '밴 페이즈별 밴률과 영향도 분석',
            en: 'Analyze ban rates and impact by phase',
        },
    },
    {
        key: 'synergy-counter',
        href: '/reports/synergy-counter',
        label: { ko: '시너지/카운터', en: 'Synergy & counter' },
        planned: true,
        summary: {
            ko: '챔피언 조합 시너지와 상성 관계',
            en: 'Champion pair synergy and counters',
        },
    },
];

const proItems: NavItemFull[] = [
    {
        key: 'meta-shift',
        href: '/pro/meta-shift',
        label: { ko: '메타 시프트 탐지', en: 'Meta shift detection' },
        pro: true,
        planned: true,
        summary: {
            ko: '패치 전후 급상승·급하락을 자동 탐지',
            en: 'Auto-detect rises/falls across patches',
        },
    },
    {
        key: 'hotfix',
        href: '/pro/hotfix',
        label: { ko: '핫픽스 감지', en: 'Hotfix detection' },
        pro: true,
        planned: true,
        summary: {
            ko: '핫픽스 반영 시 급변 지점 표시',
            en: 'Mark sharp changes on hotfixes',
        },
    },
    {
        key: 'timeline-events',
        href: '/pro/timeline-events',
        label: { ko: '타임라인 이벤트 분석', en: 'Timeline event analysis' },
        pro: true,
        planned: true,
        summary: {
            ko: '첫 귀환/코어템/오브젝트 타이밍과 승률의 관계',
            en: 'First recall/core/objective timing vs win',
        },
    },
    {
        key: 'objectives',
        href: '/pro/objectives',
        label: { ko: '오브젝트 상관관계', en: 'Objectives correlation' },
        pro: true,
        planned: true,
        summary: {
            ko: '드래곤/전령/바론/타워와 승률의 상관관계',
            en: 'Correlation of dragons/herald/baron/towers with win rate',
        },
    },
    {
        key: 'game-length',
        href: '/pro/game-length',
        label: { ko: '게임 길이 구간', en: 'Game length buckets' },
        pro: true,
        planned: true,
        summary: {
            ko: '게임 시간 구간별 지표 비교',
            en: 'Compare metrics across game-length buckets',
        },
    },
    {
        key: 'lead-curve',
        href: '/pro/lead-curve',
        label: { ko: '초반 리드 → 승률 곡선', en: 'Early lead → win curve' },
        pro: true,
        planned: true,
        summary: {
            ko: '초반 골드/경험치 격차와 승률의 함수 관계',
            en: 'Relationship between early leads and win rate',
        },
    },
    {
        key: 'position-shift',
        href: '/pro/position-shift',
        label: { ko: '포지션 변경/스왑', en: 'Position shift/swap' },
        pro: true,
        planned: true,
        summary: {
            ko: '포지션 스왑 발생 시 성능 변화',
            en: 'Effects of role swaps on performance',
        },
    },
    {
        key: 'region-compare',
        href: '/pro/region-compare',
        label: { ko: '지역 비교', en: 'Region comparison' },
        pro: true,
        planned: true,
        summary: {
            ko: '지역별 메타 차이와 성능 비교',
            en: 'Compare meta differences across regions',
        },
    },
    {
        key: 'runes-summoners',
        href: '/pro/runes-summoners',
        label: { ko: '룬/소환사 주문 영향', en: 'Runes & summoners' },
        pro: true,
        planned: true,
        summary: {
            ko: '룬과 소환사 주문 선택이 성능에 미치는 영향',
            en: 'Impact of rune and summoner choices on performance',
        },
    },
    {
        key: 'build-recommender',
        href: '/pro/build-recommender',
        label: { ko: '추천 빌드/룬 생성', en: 'Build/rune recommender' },
        pro: true,
        planned: true,
        summary: {
            ko: '통계 기반 최적 빌드/룬 추천',
            en: 'Stat-based build and rune recommendations',
        },
    },
    {
        key: 'ban-recommender',
        href: '/pro/ban-recommender',
        label: { ko: '밴 추천', en: 'Ban recommender' },
        pro: true,
        planned: true,
        summary: {
            ko: '상대 풀/조합 기반 밴 제안',
            en: 'Ban suggestions based on opponent pool/comps',
        },
    },
    {
        key: 'ddragon-diff',
        href: '/pro/ddragon-diff',
        label: { ko: '아이템/챔피언 변경 비교 뷰어', en: 'Item/Champion diff viewer' },
        pro: true,
        planned: true,
        summary: {
            ko: '데이터 변경 내역(패치 노트 기반) 비교',
            en: 'Viewer for item/champion data diffs across patches',
        },
    },
    {
        key: 'multi-patch-report',
        href: '/pro/multi-patch-report',
        label: { ko: '버전 비교 리포트', en: 'Multi-patch report' },
        pro: true,
        planned: true,
        summary: {
            ko: '여러 패치 간 주요 지표 변화 비교',
            en: 'Compare key metrics across multiple patches',
        },
    },
    {
        key: 'outlier',
        href: '/pro/outlier',
        label: { ko: '이상치 탐지', en: 'Outlier detection' },
        pro: true,
        planned: true,
        summary: {
            ko: '비정상적으로 높은/낮은 지표 식별',
            en: 'Detect unusually high/low performance metrics',
        },
    },
];

export const NAV_SECTIONS: NavSection[] = [
    { id: 'core',     title: { ko: '핵심 리포트',   en: 'Core Reports' },      items: coreItems },
    { id: 'advanced', title: { ko: '고급 분석',     en: 'Advanced Analytics' }, items: proItems  },
];

// ====== (옵션) 기존 단순 타입과 배열을 계속 쓰고 싶다면 어댑터 제공 ======
export type NavItem = {
    key: string;
    href: string;
    ko: string;
    en: string;
    pro?: boolean;
    planned?: boolean;
    descKo?: string;
    descEn?: string;
};

export const coreNav: NavItem[] = coreItems.map(i => ({
    key: i.key,
    href: i.href,
    ko: i.label.ko,
    en: i.label.en,
    planned: i.planned,
    pro: i.pro,
    descKo: i.summary?.ko,
    descEn: i.summary?.en,
}));

export const proNav: NavItem[] = proItems.map(i => ({
    key: i.key,
    href: i.href,
    ko: i.label.ko,
    en: i.label.en,
    planned: i.planned,
    pro: i.pro,
    descKo: i.summary?.ko,
    descEn: i.summary?.en,
}));