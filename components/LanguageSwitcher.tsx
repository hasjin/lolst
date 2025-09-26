'use client';
import { useI18n } from '@/components/i18n';

export default function LanguageSwitcher() {
    const { lang, setLang } = useI18n();

    return (
        <div className="lang-switch" aria-label="Language">
            <button
                type="button"
                aria-pressed={lang === 'ko'}
                onClick={() => setLang('ko')}
            >한국어</button>
            <span> / </span>
            <button
                type="button"
                aria-pressed={lang === 'en'}
                onClick={() => setLang('en')}
            >English</button>

            <style jsx>{`
        .lang-switch { display:flex; gap:6px; align-items:center; }
        .lang-switch button {
          background: transparent; border: 1px solid #2a345e; color: #cfe0ff;
          padding: 4px 8px; border-radius: 8px; cursor: pointer; font-size: 12px;
        }
        .lang-switch button[aria-pressed="true"] { background:#10192c; }
      `}</style>
        </div>
    );
}