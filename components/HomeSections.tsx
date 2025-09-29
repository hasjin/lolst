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
                <p className="section__lead">
                    <Trans ko="패치 전후 메타를 빠르게 확인할 수 있는 기본 지표 모음입니다."
                           en="Essential reports to quickly inspect pre/post-patch meta shifts." />
                </p>

                <ul className="grid cards">
                    {coreNav.map((it) => (
                        <li key={it.key} className="card">
                            <FeatureCard
                                href={it.href}
                                title={<Trans ko={it.ko} en={it.en} />}
                                desc={getDesc(it)}
                                planned={it.planned}
                            />
                        </li>
                    ))}
                </ul>
            </section>

            <section className="section">
                <h2 className="section__title">
                    <Trans ko="고급 분석" en="Advanced Analytics" />
                </h2>
                <p className="section__lead">
                    <Trans ko="데이터 확보 후 순차 공개되는 심화 기능입니다."
                           en="Deeper analyses released as more data is collected." />
                </p>

                <ul className="grid cards">
                    {proNav.map((it) => (
                        <li key={it.key} className="card">
                            <FeatureCard
                                href={it.href}
                                title={<Trans ko={it.ko} en={it.en} />}
                                desc={getDesc(it)}
                                pro
                                planned={it.planned}
                            />
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
}