'use client';

import Link from 'next/link';
import SearchBox from '@/components/SearchBox';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { SITE_NAME } from '@/lib/site';
import MobileNav from "@/components/layout/MobileNav";

export default function Head() {
    return (
        <header className="hdr">
            <div className="hdr__left">
                <Link href="/" className="brand">{SITE_NAME}</Link>
            </div>

            <div className="hdr__center">
                <SearchBox />
            </div>

            <div className="hdr__right">
                <LanguageSwitcher />
            </div>

            <MobileNav />
        </header>
    );
}