// /app/tos/page.tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Trans } from '@/components/i18n';

const SITE_NAME = "Seeres LoL Insights";
const DOMAINS = ["https://www.seeres.info", "https://lol.seeres.info"];
const LAST_UPDATED = "2025-09-26";
const CONTACT_MAIL = "angelo47417@gmail.com";

export default function Page() {
    return (
        <main className="container">
            <header className="hero" style={{display:'grid', gap:12}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div className="chip"><Trans ko="이용약관" en="Terms of Service" /></div>
                    <LanguageSwitcher />
                </div>
                <h1>{SITE_NAME}</h1>
                <p className="subtitle">
                    <Trans
                        ko="본 서비스는 Riot Games의 보증·후원·승인을 받지 않았습니다."
                        en="This service is not endorsed by Riot Games."
                    />
                </p>
                <div className="domains">{DOMAINS.map(d => <span key={d} className="domain">{d}</span>)}</div>
                <div className="meta">Last updated: {LAST_UPDATED}</div>
            </header>

            <div className="page">
                <aside className="toc">
                    <h3><Trans ko="목차" en="Contents" /></h3>
                    <nav>
                        <a href="#collect"><Trans ko="1. 수집하지 않는 정보" en="1. Data We Do Not Collect" /></a>
                        <a href="#items"><Trans ko="2. 필요에따라 처리하는 정보" en="2. Data We May Process" /></a>
                        <a href="#purpose"><Trans ko="3. 이용 목적" en="3. Purposes" /></a>
                        <a href="#retention"><Trans ko="4. 보유 기간" en="4. Retention" /></a>
                        <a href="#sharing"><Trans ko="5. 제3자 제공" en="5. Sharing" /></a>
                        <a href="#overseas"><Trans ko="6. 국외 처리" en="6. Processing Abroad" /></a>
                        <a href="#cookies"><Trans ko="7. 쿠키 및 추적" en="7. Cookies" /></a>
                        <a href="#rights"><Trans ko="8. 이용자 권리" en="8. Your Rights" /></a>
                        <a href="#security"><Trans ko="9. 안전조치" en="9. Security" /></a>
                        <a href="#children"><Trans ko="10. 아동의 개인정보" en="10. Children" /></a>
                        <a href="#notice"><Trans ko="11. 고지 및 개정" en="11. Notice & Changes" /></a>
                        <a href="#contact"><Trans ko="12. 문의처" en="12. Contact" /></a>
                        <a href="#riot"><Trans ko="붙임: Riot 고지" en="Appendix: Riot Notice" /></a>
                    </nav>
                </aside>

                <article className="prose">
                    <Trans
                        ko={
                            <>
                                <section id="collect"><h2>1. 수집하지 않는 정보</h2><p>회원가입·커뮤니티 기능이 없으며, 필요하지 않은 개인정보는 수집하지 않습니다.</p></section>
                                <section id="items"><h2>2. 필요에따라 처리하는 정보</h2><ul><li><b>문의 이메일</b>: 자발적 문의 시 이메일·내용</li><li><b>기술 로그</b>: 시간, 오류 로그 등</li></ul></section>
                                <section id="purpose"><h2>3. 이용 목적</h2><ul><li>서비스 운영·오류 대응·품질 개선</li><li>보안 및 이상 행위 탐지</li><li>문의 응대</li></ul></section>
                                <section id="retention"><h2>4. 보유 기간</h2><ul><li>문의: 처리 완료 후 최대 3년</li><li>기술 로그: 6~12개월</li><li>법령상 별도 기간 준수</li></ul></section>
                                <section id="sharing"><h2>5. 제3자 제공</h2><p>원칙적으로 제공하지 않음. 법령상 요청 또는 동의 시 예외.</p></section>
                                <section id="overseas"><h2>6. 국외 처리</h2><p>호스팅/CDN 특성상 해외에서 처리될 수 있으며, HTTPS·권한 통제를 적용합니다.</p></section>
                                <section id="cookies"><h2>7. 쿠키 및 추적</h2><p>마케팅 쿠키는 사용하지 않음. 필수 기술 쿠키만 사용될 수 있으며 브라우저에서 차단/삭제 가능.</p></section>
                                <section id="rights"><h2>8. 이용자 권리</h2><p>열람·정정·삭제·처리정지 요청 가능(아래 연락처).</p></section>
                                <section id="security"><h2>9. 안전조치</h2><ul><li>최소 수집·접근권한 통제</li><li>HTTPS</li><li>로그 모니터링</li><li>정기 업데이트</li></ul></section>
                                <section id="children"><h2>10. 아동의 개인정보</h2><p>만 14세 미만 대상 아님.</p></section>
                                <section id="notice"><h2>11. 고지 및 개정</h2><p>중요 변경 시 사전 고지 및 시행일 명시.</p></section>
                                <section id="contact"><h2>12. 문의처</h2><p>{CONTACT_MAIL}</p></section>
                                <section id="riot"><h2>붙임: Riot 고지</h2><p>본 서비스는 Riot Games의 보증·후원·승인을 받지 않았습니다.</p></section>
                            </>
                        }
                        en={
                            <>
                                <section id="collect"><h2>1. Data We Do Not Collect</h2><p>No accounts or community features. We do not collect personal identifiers beyond what is necessary to operate the Service.</p></section>
                                <section id="items"><h2>2. Data We May Process</h2><ul><li><b>Inquiry email</b>: If you email us voluntarily, we will process your address and message.</li><li><b>Technical logs</b>: timestamps, error logs for security/operations.</li></ul></section>
                                <section id="purpose"><h2>3. Purposes</h2><ul><li>Operate the Service, fix errors, improve quality</li><li>Security and abuse detection</li><li>Respond to inquiries</li></ul></section>
                                <section id="retention"><h2>4. Retention</h2><ul><li>Inquiry emails: up to 3 years after resolution</li><li>Technical logs: up to 6–12 months</li><li>Or as required by law</li></ul></section>
                                <section id="sharing"><h2>5. Sharing</h2><p>No third-party sharing unless required by law or with explicit consent.</p></section>
                                <section id="overseas"><h2>6. Processing Abroad</h2><p>Hosting/CDN providers may process logs in other countries. HTTPS, least privilege, and access controls are applied.</p></section>
                                <section id="cookies"><h2>7. Cookies</h2><p>No marketing cookies. Essential technical cookies may be used. You can block/delete cookies via your browser.</p></section>
                                <section id="rights"><h2>8. Your Rights</h2><p>You may request access, correction, deletion, or restriction. Contact us via the email below.</p></section>
                                <section id="security"><h2>9. Security</h2><ul><li>Minimal collection and access control</li><li>HTTPS in transit</li><li>Log monitoring</li><li>Regular updates</li></ul></section>
                                <section id="children"><h2>10. Children</h2><p>Not directed to children under 14.</p></section>
                                <section id="notice"><h2>11. Notice & Changes</h2><p>We will announce material changes and effective dates.</p></section>
                                <section id="contact"><h2>12. Contact</h2><p>{CONTACT_MAIL}</p></section>
                                <section id="riot"><h2>Appendix: Riot Notice</h2><p>This service is not endorsed by Riot Games. All trademarks and copyrights belong to their owners.</p></section>
                            </>
                        }
                    />
                </article>
            </div>
        </main>
    );
}