// /app/tos/page.tsx
'use client';
const SITE_NAME = "Seeres LoL Insights";
const DOMAINS = ["https://www.seeres.info", "https://lol.seeres.info"];
const LAST_UPDATED = "2025-09-26"; // 필요 시 수정

export default function Page() {
    return (
        <main className="wrap">
            <header className="hero">
                <div className="chip">이용약관</div>
                <h1>{SITE_NAME}</h1>
                <p className="subtitle">본 서비스는 Riot Games의 보증·후원·승인을 받지 않았습니다.</p>
                <div className="domains">
                    {DOMAINS.map((d) => (
                        <span key={d} className="domain">{d}</span>
                    ))}
                </div>
                <div className="meta">Last updated: {LAST_UPDATED}</div>
            </header>

            <div className="content">
                <aside className="toc">
                    <h3>목차</h3>
                    <nav>
                        <a href="#scope">제1조 목적 및 적용범위</a>
                        <a href="#change">제2조 약관의 게시 및 변경</a>
                        <a href="#service">제3조 서비스 내용</a>
                        <a href="#acceptable">제4조 이용 조건 및 금지행위</a>
                        <a href="#ip">제5조 콘텐츠 및 지식재산권</a>
                        <a href="#thirdparty">제6조 외부 서비스·표기</a>
                        <a href="#disclaimer">제7조 보증부인</a>
                        <a href="#liability">제8조 책임 제한</a>
                        <a href="#modify">제9조 서비스 변경·중단</a>
                        <a href="#law">제10조 준거법 및 관할</a>
                        <a href="#contact">제11조 연락처</a>
                    </nav>
                </aside>

                <article className="prose">
                    <section id="scope">
                        <h2>제1조 (목적 및 적용범위)</h2>
                        <p>
                            본 약관은 {SITE_NAME}(이하 “서비스”)의 웹사이트 및 제공 기능 이용에 관한 운영자와
                            이용자 간 권리·의무 및 책임사항을 규정합니다. 서비스 접속·이용은 본 약관에 대한 동의로 간주됩니다.
                        </p>
                    </section>

                    <section id="change">
                        <h2>제2조 (약관의 게시 및 변경)</h2>
                        <ol>
                            <li>운영자는 본 약관을 서비스에 게시합니다.</li>
                            <li>관련 법령을 위반하지 않는 범위에서 약관을 개정할 수 있으며, 적용일자·개정사유를 사전에 공지합니다.</li>
                            <li>공지 이후 계속 이용하면 개정 약관에 동의한 것으로 봅니다.</li>
                        </ol>
                    </section>

                    <section id="service">
                        <h2>제3조 (서비스 내용)</h2>
                        <ol>
                            <li>서비스는 LoL 패치 전후의 챔피언/아이템 지표 변화를 정보 제공 목적으로 요약·시각화합니다.</li>
                            <li>회원가입·커뮤니티 기능은 제공하지 않습니다. 결제·구매, 사용자 생성 콘텐츠 기능도 없습니다.</li>
                            <li>콘텐츠의 정확성·완전성·적시성은 보증되지 않습니다.</li>
                        </ol>
                    </section>

                    <section id="acceptable">
                        <h2>제4조 (이용 조건 및 금지행위)</h2>
                        <ul>
                            <li>서비스·서버·네트워크의 정상 작동을 방해하는 행위(과도한 요청, 자동화 수집 남용 등)를 금지합니다.</li>
                            <li>콘텐츠의 무단 복제·배포·2차적 저작물 작성 등 권리 침해 행위를 금지합니다.</li>
                            <li>역컴파일·리버스엔지니어링 등 소스 추출 시도를 금지합니다.</li>
                        </ul>
                    </section>

                    <section id="ip">
                        <h2>제5조 (콘텐츠 및 지식재산권)</h2>
                        <p>
                            서비스와 그 구성요소(텍스트, 그래픽, 코드 등)에 관한 권리는 운영자 또는 정당한 권리자에게 귀속됩니다.
                            개인적·비상업적 이용 범위를 넘어서는 사용은 사전 서면 허가가 필요합니다.
                        </p>
                    </section>

                    <section id="thirdparty">
                        <h2>제6조 (외부 서비스·표기)</h2>
                        <p>
                            본 서비스는 외부 데이터·API·호스팅을 사용할 수 있습니다. 외부 서비스의 약관·정책이 우선 적용될 수 있습니다.
                            본 서비스는 Riot Games, Inc. 및 그 계열사의 보증·후원·승인을 받지 않았습니다.
                        </p>
                    </section>

                    <section id="disclaimer">
                        <h2>제7조 (보증부인)</h2>
                        <p>서비스는 “있는 그대로(AS IS)” 제공되며 명시적·묵시적 보증을 하지 않습니다.</p>
                    </section>

                    <section id="liability">
                        <h2>제8조 (책임 제한)</h2>
                        <p>
                            운영자는 간접·특별·우발·결과적 손해에 대해 책임을 지지 않습니다. 불가항력(천재지변, 네트워크 장애, 외부 정책 변경 등)으로 인한 손해에 대해서도 마찬가지입니다.
                        </p>
                    </section>

                    <section id="modify">
                        <h2>제9조 (서비스 변경·중단)</h2>
                        <p>운영자는 필요 시 서비스의 전부 또는 일부를 변경·중단할 수 있습니다.</p>
                    </section>

                    <section id="law">
                        <h2>제10조 (준거법 및 관할)</h2>
                        <p>본 약관은 대한민국 법령을 준거법으로 하며, 분쟁은 서울중앙지방법원을 전속 관할로 합니다.</p>
                    </section>

                    <section id="contact">
                        <h2>제11조 (연락처)</h2>
                        <p>문의: contact@seeres.info</p>
                    </section>
                </article>
            </div>

            <style jsx>{`
                .wrap { padding: 32px 16px 80px; }
                .hero {
                    max-width: 980px; margin: 0 auto 28px;
                    padding: 28px 24px;
                    background: radial-gradient(1200px 400px at 20% -20%, #5b8cff33, transparent),
                    linear-gradient(180deg, #0b1220, #0b1220);
                    border: 1px solid #1c2540; border-radius: 16px;
                    color: #e8efff;
                }
                .chip {
                    display: inline-block; font-size: 12px; padding: 4px 10px; border-radius: 999px;
                    border: 1px solid #2a345e; background: #10192c; color: #9fb4ff; margin-bottom: 8px;
                }
                h1 { font-size: 28px; margin: 0 0 6px; letter-spacing: .3px; }
                .subtitle { margin: 0 0 10px; color: #b9c6ff; }
                .domains { display: flex; gap: 8px; flex-wrap: wrap; margin: 8px 0 6px; }
                .domain { font-size: 12px; padding: 4px 8px; border-radius: 8px; background: #111827; border: 1px solid #253058; color: #cfe0ff; }
                .meta { font-size: 12px; color: #9fb4ff; opacity: .85; }

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