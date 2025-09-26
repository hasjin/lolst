// /app/privacy/page.tsx
'use client';
const SITE_NAME = "Seeres LoL Insights";
const DOMAINS = ["https://www.seeres.info", "https://lol.seeres.info"];
const LAST_UPDATED = "2025-09-26"; // 필요 시 수정

export default function Page() {
    return (
        <main className="wrap">
            <header className="hero">
                <div className="chip">개인정보 처리방침</div>
                <h1>{SITE_NAME}</h1>
                <p className="subtitle">본 방침은 다음 도메인에 적용됩니다: {DOMAINS.join(", ")}</p>
                <div className="meta">Last updated: {LAST_UPDATED}</div>
            </header>

            <div className="content">
                <aside className="toc">
                    <h3>목차</h3>
                    <nav>
                        <a href="#collect">1. 수집하지 않는 정보</a>
                        <a href="#items">2. 처리하는 정보(필요 시)</a>
                        <a href="#purpose">3. 이용 목적</a>
                        <a href="#retention">4. 보유 기간</a>
                        <a href="#sharing">5. 제3자 제공</a>
                        <a href="#overseas">6. 국외 처리(호스팅/네트워크)</a>
                        <a href="#cookies">7. 쿠키 및 추적</a>
                        <a href="#rights">8. 이용자 권리</a>
                        <a href="#security">9. 안전조치</a>
                        <a href="#children">10. 아동의 개인정보</a>
                        <a href="#notice">11. 고지 및 개정</a>
                        <a href="#contact">12. 문의처</a>
                        <a href="#riot">붙임: Riot 고지</a>
                    </nav>
                </aside>

                <article className="prose">
                    <section id="collect">
                        <h2>1. 수집하지 않는 정보</h2>
                        <p>
                            서비스는 회원가입·커뮤니티 기능을 제공하지 않으며, 이용자 계정을 생성하지 않습니다.
                            서비스 제공에 필수적이지 않은 개인정보(이름, 생년월일 등)는 수집하지 않습니다.
                        </p>
                    </section>

                    <section id="items">
                        <h2>2. 처리하는 정보(필요 시)</h2>
                        <ul>
                            <li><b>문의 이메일</b>: 이용자가 자발적으로 이메일로 문의하는 경우에 한해 발신 이메일 주소와 문의 내용이 처리될 수 있습니다.</li>
                            <li><b>기술 로그</b>: 보안·운영 목적의 서버 로그(IP, 요청 URL/시간, 사용자 에이전트, 오류 로그 등)가 자동 생성·저장될 수 있습니다.</li>
                        </ul>
                    </section>

                    <section id="purpose">
                        <h2>3. 이용 목적</h2>
                        <ul>
                            <li>서비스 운영, 오류 대응, 품질 개선</li>
                            <li>보안 및 이상 행위 탐지</li>
                            <li>문의 응대</li>
                        </ul>
                    </section>

                    <section id="retention">
                        <h2>4. 보유 기간</h2>
                        <ul>
                            <li>문의 이메일: 처리 완료 후 최대 3년</li>
                            <li>기술 로그: 수집일로부터 최대 6~12개월</li>
                            <li>법령상 별도 규정이 있는 경우 해당 기간</li>
                        </ul>
                    </section>

                    <section id="sharing">
                        <h2>5. 제3자 제공</h2>
                        <p>원칙적으로 제3자에게 개인정보를 제공하지 않습니다. 법령에 따른 적법한 요청 또는 이용자 동의가 있는 경우 예외적으로 제공될 수 있습니다.</p>
                    </section>

                    <section id="overseas">
                        <h2>6. 국외 처리(호스팅/네트워크)</h2>
                        <p>
                            호스팅·CDN·네트워크 사업자의 인프라 위치에 따라 기술 로그가 해외에서 처리될 수 있습니다.
                            전송 구간은 HTTPS로 보호되며, 최소한의 항목만 취급하도록 관리합니다.
                        </p>
                    </section>

                    <section id="cookies">
                        <h2>7. 쿠키 및 추적</h2>
                        <p>
                            당사는 이용자 맞춤형 마케팅을 위한 쿠키를 설정하지 않습니다.
                            호스팅/보안 목적으로 필수적인 기술 쿠키 또는 유사 식별자가 사용될 수 있으며,
                            브라우저 설정을 통해 쿠키 저장을 거부·삭제할 수 있습니다.
                        </p>
                    </section>

                    <section id="rights">
                        <h2>8. 이용자 권리</h2>
                        <p>
                            이용자는 본인 관련 정보에 대해 열람, 정정·삭제, 처리정지를 요청할 수 있습니다.
                            문의는 아래 연락처로 보내주세요.
                        </p>
                    </section>

                    <section id="security">
                        <h2>9. 안전조치</h2>
                        <ul>
                            <li>최소 수집·접근권한 통제</li>
                            <li>전송 구간 암호화(HTTPS)</li>
                            <li>접근 로그 및 이상 징후 모니터링</li>
                            <li>정기 보안 업데이트</li>
                        </ul>
                    </section>

                    <section id="children">
                        <h2>10. 아동의 개인정보</h2>
                        <p>서비스는 만 14세 미만 아동을 대상으로 하지 않습니다. 인지 시 지체 없이 삭제합니다.</p>
                    </section>

                    <section id="notice">
                        <h2>11. 고지 및 개정</h2>
                        <p>중요 변경 시 서비스 공지 또는 이메일(해당 시)을 통해 사전 고지합니다. 변경 이력과 시행일을 명시합니다.</p>
                    </section>

                    <section id="contact">
                        <h2>12. 문의처</h2>
                        <p>개인정보 문의: admin@seeres.info / contact@seeres.info</p>
                    </section>

                    <section id="riot">
                        <h2>붙임: Riot 고지</h2>
                        <p>본 서비스는 Riot Games, Inc. 또는 그 계열사의 보증·후원·승인을 받지 않았습니다. 모든 상표·저작권은 각 권리자에게 귀속됩니다.</p>
                    </section>
                </article>
            </div>

            <style jsx>{`
                .wrap { padding: 32px 16px 80px; }
                .hero {
                    max-width: 980px; margin: 0 auto 28px;
                    padding: 28px 24px;
                    background: radial-gradient(1200px 400px at 20% -20%, #34d39933, transparent),
                    linear-gradient(180deg, #0b1220, #0b1220);
                    border: 1px solid #1c2540; border-radius: 16px;
                    color: #e8fff4;
                }
                .chip {
                    display: inline-block; font-size: 12px; padding: 4px 10px; border-radius: 999px;
                    border: 1px solid #1f3b33; background: #0d1f1a; color: #9ef0c2; margin-bottom: 8px;
                }
                h1 { font-size: 28px; margin: 0 0 6px; letter-spacing: .3px; }
                .subtitle { margin: 0 0 10px; color: #bff7da; }
                .meta { font-size: 12px; color: #9ef0c2; opacity: .85; }

                .content { max-width: 1080px; margin: 0 auto; display: grid; grid-template-columns: 240px 1fr; gap: 24px; }
                .toc { position: sticky; top: 16px; height: fit-content; padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; }
                .toc h3 { margin: 0 0 8px; font-size: 14px; color: #111827; }
                .toc nav { display: grid; gap: 8px; }
                .toc a { color: #374151; text-decoration: none; font-size: 13px; }
                .toc a:hover { color: #111827; text-decoration: underline; }

                .prose { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; color: #111827; line-height: 1.75; }
                .prose h2 { margin-top: 28px; margin-bottom: 10px; font-size: 20px; }
                .prose p { margin: 8px 0; }
                .prose ul, .prose ol { margin: 6px 0 12px 18px; }
                @media (max-width: 900px) {
                    .content { grid-template-columns: 1fr; }
                    .toc { position: static; }
                }
            `}</style>
        </main>
    );
}