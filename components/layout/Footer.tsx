'use client';

// components/layout/Footer.tsx
import Link from "next/link";
import {Trans} from "@/components/i18n";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__inner">
                <span>© <span suppressHydrationWarning>{new Date().getFullYear()}</span> Seeres LoL Insights.</span>
                <span>This service is not endorsed by Riot Games.</span>
                <nav className="ftr__links" aria-label="Footer">
                    <Link href="/privacy"><Trans ko="개인정보 처리방침" en="Privacy" /></Link>
                    <span aria-hidden="true" className="sep">·</span>
                    <Link href="/tos"><Trans ko="이용약관" en="Terms" /></Link>
                </nav>
            </div>

        </footer>
    );
}

