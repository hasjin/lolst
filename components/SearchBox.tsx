'use client';

import { Trans, useI18n } from '@/components/i18n';

export default function SearchBox() {
    const { lang } = useI18n();

    return (
        <form
            className="search"
            suppressHydrationWarning
            onSubmit={(e) => {
                e.preventDefault();
                const q = new FormData(e.currentTarget).get('q')?.toString().trim();
                alert(
                    lang === 'en'
                        ? `Coming soon: search "${q || ''}"`
                        : `지원 예정입니다: 검색 "${q || ''}"`
                );
            }}
        >
            <input
                name="q"
                autoComplete="off"
                suppressHydrationWarning
                placeholder={
                    lang === 'en'
                        ? 'Search champion / item / patch (e.g., Ahri, 25.19, Trinity)'
                        : '챔피언/아이템/패치 검색 (예: Ahri, 25.19, Trinity)'
                }
            />
            <button type="submit" className="btn">
              <span suppressHydrationWarning>
                <Trans ko="검색" en="Search" />
              </span>
            </button>
        </form>
    );
}