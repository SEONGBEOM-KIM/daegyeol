import Link from "next/link";

export default function Home() {
  return (
    <main className="home">
      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">개인화 선택 도우미</p>
        <h1 id="hero-title">대신 결정해드립니다</h1>
        <p className="subtitle">
          선택지가 많아 망설여질 때, 당신의 성향과 현재 고민을 바탕으로
          하나의 선택지를 이유와 함께 추천합니다.
        </p>
        <div className="actions">
          <Link className="primaryAction" href="/signup">
            시작하기
          </Link>
          <Link className="secondaryAction" href="/login">
            로그인
          </Link>
          <a className="secondaryAction" href="#how-it-works">
            어떻게 도와주나요?
          </a>
        </div>
      </section>

      <section className="summary" id="how-it-works" aria-label="앱 사용 흐름">
        <article>
          <span>1</span>
          <h2>고민 입력</h2>
          <p>상품, 음식, 여행지처럼 결정하기 어려운 고민과 선택지를 입력합니다.</p>
        </article>
        <article>
          <span>2</span>
          <h2>성향 반영</h2>
          <p>저장된 성향과 현재 상황을 바탕으로 추천 기준을 정리합니다.</p>
        </article>
        <article>
          <span>3</span>
          <h2>하나 추천</h2>
          <p>추천한 선택지, 짧은 이유, 제외 이유, 확신도를 보여줍니다.</p>
        </article>
      </section>
    </main>
  );
}
