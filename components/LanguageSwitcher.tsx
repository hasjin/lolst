'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/components/i18n';

export default function LanguageSwitcher() {
    const { lang, setLang } = useI18n();
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const popRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            if (!open) return;
            if (!btnRef.current || !popRef.current) return;
            const t = e.target as Node;
            if (!btnRef.current.contains(t) && !popRef.current.contains(t)) setOpen(false);
        };
        const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);

        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onEsc);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onEsc);
        };
    }, [open]);

    const label = mounted ? (lang === 'ko' ? '한국어' : 'English') : '한국어';

    return (
        <div className="langSwitch">
            <button
                ref={btnRef}
                type="button"
                className="btn btn--ghost"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen(v => !v)}
            >
                <span className="globe" aria-hidden>🌐</span>
                <span suppressHydrationWarning>{label}</span>
            </button>

            {open && (
                <div ref={popRef} role="menu" className="langMenu">
                    <button
                        role="menuitemradio"
                        aria-checked={lang === 'ko'}
                        onClick={() => { setLang('ko'); setOpen(false); }}
                    >
                        한국어
                    </button>
                    <button
                        role="menuitemradio"
                        aria-checked={lang === 'en'}
                        onClick={() => { setLang('en'); setOpen(false); }}
                    >
                        English
                    </button>
                </div>
            )}
        </div>
    );
}