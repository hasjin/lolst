// components/i18n.tsx
'use client';
import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type Lang = 'ko' | 'en';

type I18nContext = {
    lang: Lang;
    setLang: (l: Lang) => void;
    toggle: () => void;
    /** 문자열이 필요한 곳(placeholder, aria-label 등)에서 사용 */
    t: (text: string | { ko: string; en: string }) => string;
};

const I18nCtx = createContext<I18nContext | null>(null);

export function I18nProvider({
                                 children,
                                 defaultLang = 'ko',
                             }: { children: ReactNode; defaultLang?: Lang }) {
    const [lang, setLang] = useState<Lang>(defaultLang);

    useEffect(() => {
        const saved = (typeof window !== 'undefined' && localStorage.getItem('lang')) as Lang | null;
        if (saved && (saved === 'ko' || saved === 'en')) setLang(saved);
    }, []);
    useEffect(() => {
        if (typeof window !== 'undefined') localStorage.setItem('lang', lang);
    }, [lang]);

    const value = useMemo<I18nContext>(() => ({
        lang,
        setLang,
        toggle: () => setLang(l => (l === 'ko' ? 'en' : 'ko')),
        t: (text) => (typeof text === 'string' ? text : (lang === 'ko' ? text.ko : text.en)),
    }), [lang]);

    return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
    const ctx = useContext(I18nCtx);
    if (!ctx) throw new Error('useI18n must be used within I18nProvider');
    return ctx;
}

/** ⬇️ JSX도 받을 수 있도록 타입을 ReactNode로 변경 */
export function Trans({ ko, en }: { ko: ReactNode; en: ReactNode }) {
    const { lang } = useI18n();
    return <>{lang === 'ko' ? ko : en}</>;
}