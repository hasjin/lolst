// lib/queues.ts
export type Lang = 'ko' | 'en';

const QUEUE_LABELS: Record<number, { ko: string; en: string }> = {
    420: { ko: '솔로 랭크', en: 'Ranked Solo/Duo' },
    440: { ko: '자유 랭크', en: 'Ranked Flex' },
    430: { ko: '일반(블라인드)', en: 'Blind Pick' },
    400: { ko: '일반(드래프트)', en: 'Draft Pick' },
    450: { ko: '칼바람 나락', en: 'ARAM' },
    700: { ko: '클래시', en: 'Clash' },
    1700: { ko: '아레나', en: 'Arena' },
};

export function queueLabel(queue: number, lang: Lang) {
    return QUEUE_LABELS[queue]?.[lang] ?? (lang === 'ko' ? '알 수 없는 큐' : 'Unknown queue');
}