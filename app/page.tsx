import HomeSections from '@/components/HomeSections';
import { Trans } from '@/components/i18n';

const SITE_NAME = 'Seeres LoL Insights';
const LAST_UPDATED = '2025-09-26';

export default function Page() {
    return (
        <>
            <section className="hero">
                <div className="badge">Beta</div>
                <h1>{SITE_NAME}</h1>
                <p className="subtitle">
                    <Trans ko={<>패치 전후 <b>챔피언/아이템</b> 메타 변화를 한눈에. 지역/티어/라인까지 정교하게 분해합니다.</>}
                           en={<>See <b>champion/item</b> meta changes before/after patches. Filter by region, tier, and role.</>} />
                </p>
                <div className="meta"><Trans ko="최신 갱신일:" en="Last updated:" /> {LAST_UPDATED}</div>
            </section>

            <HomeSections />
        </>
    );
}