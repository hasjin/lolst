'use client';

import { Trans, useI18n } from '@/components/i18n';

export default function FeatureCard({
                                        variant,
                                        title,
                                        desc,
                                    }: {
    variant: 'Core' | 'Pro';
    title: React.ReactNode;
    desc: React.ReactNode;
}) {
    const { lang } = useI18n();

    return (
        <button
            type="button"
            onMouseMove={(e) => {
                const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                (e.currentTarget as HTMLButtonElement).style.setProperty('--mx', `${x}%`);
            }}
            onClick={() =>
                alert(
                    lang === 'en'
                        ? 'Coming soon: feature preview'
                        : '지원 예정입니다: 기능 미리보기'
                )
            }
            aria-label="feature-card"
        >
            <div className="card-head">
                <span className={`chip ${variant === 'Pro' ? 'alt' : ''}`}>{variant}</span>
                <h3>{title}</h3>
            </div>
            <p>{desc}</p>
            <div className="cta">
                <Trans ko="자세히 보기" en="Learn more" />
            </div>
        </button>
    );
}