import { coreNav, proNav, type NavItem} from '@/lib/nav';
import FeatureCard from '@/components/FeatureCard';
import { Trans } from '@/components/i18n';

export default function HomeSections() {
    const getDesc = (it: NavItem) =>
        (it.descKo || it.descEn)
            ? <Trans ko={it.descKo ?? ''} en={it.descEn ?? ''} />
            : undefined;
    return (
        <>
            <section className="section">
                <h2 className="section__title">
                    <Trans ko="핵심 리포트" en="Core Reports" />
                </h2>

                <ul className="grid cards">
                    {coreNav.map((it) => (
                        <li key={it.key} className="card">
                            <FeatureCard
                                href={it.href}
                                title={<Trans ko={it.ko} en={it.en} />}
                                desc={getDesc(it)}
                                planned
                            />
                        </li>
                    ))}
                </ul>
            </section>

            <section className="section">
                <h2 className="section__title">
                    <Trans ko="고급 분석" en="Advanced Analytics" />
                </h2>

                <ul className="grid cards">
                    {proNav.map((it) => (
                        <li key={it.key} className="card">
                            <FeatureCard
                                href={it.href}
                                title={<Trans ko={it.ko} en={it.en} />}
                                desc={getDesc(it)}
                                pro
                                planned
                            />
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
}