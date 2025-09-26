'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Locale = 'ko'|'en';
type Ctx = { lang: Locale; setLang: (l: Locale) => void };

const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ defaultLang, children }:{
    defaultLang: Locale; children: React.ReactNode;
}) {
    const [lang, setLang] = useState<Locale>(() => {
        try {
            const saved = localStorage.getItem('lang') as Locale | null;
            return (saved === 'en' || saved === 'ko') ? saved : defaultLang;
        } catch {
            return defaultLang;
        }
    });

    useEffect(() => {
        try { localStorage.setItem('lang', lang); } catch {}
        try { document.documentElement.setAttribute('lang', lang); } catch {}
    }, [lang]);

    const value = useMemo(() => ({ lang, setLang }), [lang]);
    return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
    const ctx = useContext(I18nCtx);
    if (!ctx) throw new Error('useI18n must be used within I18nProvider');
    return ctx;
}

export function Trans({ ko, en }: { ko: React.ReactNode; en: React.ReactNode }) {
    const { lang } = useI18n();
    return <>{lang === 'en' ? en : ko}</>;
}