'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // 클라이언트에서만 실행
        const savedTheme = document.cookie.match(/theme=(light|dark)/)?.[1] as 'light' | 'dark' | undefined;
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const currentTheme = savedTheme || systemTheme;
        setTheme(currentTheme);
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        document.cookie = `theme=${newTheme}; path=/; max-age=31536000`; // 1년
    };

    // 하이드레이션 미스매치 방지
    if (!mounted) {
        return <div style={{ width: 40, height: 40 }} />;
    }

    return (
        <button
            onClick={toggleTheme}
            className="themeToggle"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
}
