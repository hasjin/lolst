'use client';

import { DOMAINS, LAST_UPDATED } from '@/lib/site';
import { Trans } from '@/components/i18n';

export default function RightWing() {
    return (
        <aside className="rnb">
            <section className="card rnb__card">
                <h4><Trans ko="상태" en="Status" /></h4>
                <div className="muted"><Trans ko="최신 갱신일" en="Last updated" />: {LAST_UPDATED}</div>
            </section>

            <section className="card rnb__card">
                <h4><Trans ko="도메인" en="Domains" /></h4>
                <ul className="muted">
                    {DOMAINS.map(d => <li key={d}>{d}</li>)}
                </ul>
            </section>
        </aside>
    );
}