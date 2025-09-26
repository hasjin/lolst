'use client';

export default function SearchBox() {
    return (
        <form className="search" suppressHydrationWarning onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get('q')?.toString().trim();
            alert(q ? `지원 예정입니다: 검색 "${q}"` : '지원 예정입니다: 검색');
        }}>
            <input
                name="q"
                placeholder="챔피언/아이템/패치 검색 (예: Ahri, 25.19, Trinity)"
                suppressHydrationWarning
                autoComplete="off"
            />
            <button type="submit">검색</button>
        </form>
    );
}