'use client';

import Link from 'next/link';
import { Trans } from '@/components/i18n';
import type { ReactNode } from 'react';

type Props = {
    title: ReactNode;
    desc?: ReactNode;
    href?: string;
    pro?: boolean;
    planned?: boolean;
};

export default function FeatureCard({
                                        title,
                                        desc,
                                        href = '#',
                                        pro = false,
                                        planned = false,
                                    }: Props) {
    const disabled = planned || href === '#';

    return (
        <Link
            href={disabled ? '#' : href}
            className="cardLink"
            aria-disabled={disabled}
            onClick={(e) => {
                if (disabled) e.preventDefault();
            }}
        >
            <article className={`fcard${planned ? ' is-planned' : ''}`}>
                <header className="fcard__head">
                    <div className="fcard__badges">
                        {pro && <span className="badge badge--pro">Pro</span>}
                        {planned && (
                            <span className="badge badge--muted">
                <Trans ko="지원 예정" en="Planned" />
              </span>
                        )}
                    </div>
                    <h3 className="fcard__title">{title}</h3>
                    {desc && <p className="fcard__desc">{desc}</p>}
                </header>

                <footer className="fcard__foot">
          <span className="btn btn--ghost">
            <Trans ko="자세히 보기" en="Details" />
          </span>
                </footer>
            </article>
        </Link>
    );
}