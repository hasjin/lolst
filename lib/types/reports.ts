// lib/types/reports.ts
export type PatchChampImpactRow = {
    championId: number;
    games: number;
    wins: number;
    winRate: number;   // 0~1
    pickRate: number;  // 0~1
    banRate: number;   // 0~1
    dWinRate: number;  // 0~1 차이
    dPickRate: number; // 0~1 차이
    dBanRate: number;  // 0~1 차이
};