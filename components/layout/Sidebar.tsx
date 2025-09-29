'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Trans } from '@/components/i18n';
import { coreNav, proNav } from '@/lib/nav';

export default function Sidebar() {
    const [openCore, setOpenCore] = useState(true);
    const [openPro, setOpenPro]   = useState(true);

    useEffect(() => {
        const c = localStorage.getItem('lnb.core');
        const p = localStorage.getItem('lnb.pro');
        if (c !== null) setOpenCore(c === '1');
        if (p !== null) setOpenPro(p === '1');
    }, []);
    useEffect(() => { localStorage.setItem('lnb.core', openCore ? '1' : '0'); }, [openCore]);
    useEffect(() => { localStorage.setItem('lnb.pro',  openPro  ? '1' : '0'); }, [openPro]);

    return (
        <nav className="lnb" aria-label="Primary">
            {/* Core */}
            <div className="lnb__group" data-open={openCore} aria-expanded={openCore}>
                <button className="lnb__groupHead" onClick={() => setOpenCore(v => !v)}>
                      <span className="lnb__groupTitle">
                        <span suppressHydrationWarning><Trans ko="핵심 리포트" en="Core" /></span>
                      </span>
                    <span className="lnb__chev">▾</span>
                </button>
                {openCore && (
                    <ul className="lnb__list">
                        {coreNav.map(it => (
                            <li key={it.key}>
                                <Link className="lnb__link" href={it.href}>
                  <span className="lnb__label">
                    <Trans ko={it.ko} en={it.en} />
                  </span>
                                    {/* 핵심은 pro 아님. “지원 예정”만 표시 */}
                                    <span className="lnb__pills">
                                        {it.planned &&
                    <span className="lnb__pill lnb__pill--muted">
                      <Trans ko="지원 예정" en="Planned" />
                    </span>
                                        }
                  </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Advanced / Pro */}
            <div className="lnb__group" data-open={openPro} aria-expanded={openPro}>
                <button className="lnb__groupHead" onClick={() => setOpenPro(v => !v)}>
                      <span className="lnb__groupTitle">
                        <span suppressHydrationWarning><Trans ko="고급 분석" en="Advanced" /></span>
                      </span>
                    <span className="lnb__chev">▾</span>
                </button>
                {openPro && (
                    <ul className="lnb__list">
                        {proNav.map(it => (
                            <li key={it.key}>
                                <Link className="lnb__link" href={it.href}>
                                  <span className="lnb__label">
                                    <Trans ko={it.ko} en={it.en} />
                                  </span>
                                                    <span className="lnb__pills">
                                    <span className="lnb__pill">Pro</span>
                                                        {it.planned &&
                                    <span className="lnb__pill lnb__pill--muted">
                                      <Trans ko="지원 예정" en="Planned" />
                                    </span>
                                                        }
                                  </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </nav>
    );
}