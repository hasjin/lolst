'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Toggle a class on <html> and add Escape-to-close
  useEffect(() => {
    const root = document.documentElement;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    root.classList.toggle('is-nav-open', open);
    document.addEventListener('keydown', onKey);
    return () => {
      root.classList.remove('is-nav-open');
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Close when clicking outside the sidebar/hamburger (capture phase so it runs first)
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest('.hamburger')) return;               // ignore clicks on the hamburger
      // treat any element inside the sidebar (marked with id, data attribute, or .lnb class) as inside
      if (t.closest('#app-sidebar,[data-app-sidebar],.lnb')) return;
      setOpen(false);                                    // otherwise, close
    };
    document.addEventListener('click', onDocClick, true);
    return () => document.removeEventListener('click', onDocClick, true);
  }, [open]);

  const scrim = open
    ? createPortal(
        <button
          type="button"
          className="nav-scrim"
          aria-label="Close menu"
          aria-hidden={false}
          onClick={() => setOpen(false)}
        />,
        document.body
      )
    : null;

  return (
    <>
      <button
        type="button"
        className="hamburger"
        aria-expanded={open}
        aria-controls="app-sidebar"
        onClick={() => setOpen(v => !v)}
      >
        <span className="hamburger__icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
          </svg>
        </span>
        <span className="hamburger__label">메뉴</span>
      </button>

      {scrim}
    </>
  );
}