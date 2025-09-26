'use client';

export default function FeatureCard({ variant, title, desc }:{
    variant: 'Core'|'Pro'; title: string; desc: string;
}) {
    return (
        <button
            type="button"
            onClick={() => alert(`지원 예정입니다: ${title}`)}
            style={{ all:'unset', display:'block', width:'100%' }}
            aria-label={`${title} 기능 카드`}
        >
            <div className="card-head">
                <span className={`chip ${variant==='Pro' ? 'alt' : ''}`}>{variant}</span>
                <h3>{title}</h3>
            </div>
            <p>{desc}</p>
            <div className="cta">자세히 보기</div>
        </button>
    );
}