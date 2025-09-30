'use client';

import Link from 'next/link';
import { Trans } from '@/components/i18n';
import type { ReactNode } from 'react';

type Props = {
    title: ReactNode;
    desc?: ReactNode;
    href?: string;        // 실제 라우트가 있을 때만 전달
    pro?: boolean;
    planned?: boolean;    // true면 비활성 카드로 표시
};

function CardInner({ title, desc, pro, planned }: Omit<Props, 'href'>) {
    return (
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
    );
}

export default function FeatureCard({ title, desc, href, pro = false, planned = false }: Props) {
    const disabled = planned || !href;

    // 비활성: 링크를 렌더하지 않음 (접근성/SEO/모바일 부작용 방지)
    if (disabled) {
        return (
            <div className="cardLink is-disabled" aria-disabled="true">
                <CardInner title={title} desc={desc} pro={pro} planned={planned} />
            </div>
        );
    }

    // 활성: 실제 라우트만 링크 렌더
    return (
        <Link href={href} className="cardLink" prefetch={false}>
            <CardInner title={title} desc={desc} pro={pro} planned={planned} />
        </Link>
    );
}