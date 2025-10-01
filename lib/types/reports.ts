/**
 * 리포트 데이터 타입 정의
 */

// 패치별 챔피언 영향도 데이터
export type PatchChampImpactRow = {
    championId: number;
    games?: number;
    wins?: number;
    bans?: number;
    winRate: number;   // 0~1
    pickRate: number;  // 0~1
    banRate: number;   // 0~1
    dWinRate: number;  // 0~1 차이
    dPickRate: number; // 0~1 차이
    dBanRate: number;  // 0~1 차이
    // 신뢰 구간 (선택적)
    winRateCI?: [number, number];
    pickRateCI?: [number, number];
    banRateCI?: [number, number];
};

// 밴픽 분석 데이터 (API 응답 스펙)
export type BanPickAnalysisRow = {
    championId: number;
    games: number;      // 게임 수
    wins: number;       // 승리 수
    bans: number;       // 밴 횟수
    winRate: number;    // 승률 (0~1)
    pickRate: number;   // 픽률 (0~1)
    banRate: number;    // 밴률 (0~1)
    region?: string;    // 필터 적용 시 지역
    tier?: string;      // 필터 적용 시 티어
    role?: string;      // 필터 적용 시 라인
};