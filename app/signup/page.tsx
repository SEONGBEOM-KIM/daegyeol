import Link from "next/link";
import { signup } from "./actions";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { error } = await searchParams;

  return (
    <main className="authPage">
      <section className="authCard" aria-labelledby="signup-title">
        <Link className="backLink" href="/">
          ← 첫 화면으로
        </Link>

        <div className="authHeading">
          <p className="eyebrow">대결 시작하기</p>
          <h1 id="signup-title">회원가입</h1>
          <p>
            이메일과 비밀번호로 계정을 만들면 성향과 추천 기록을 안전하게
            분리해 저장할 수 있습니다.
          </p>
        </div>

        {error ? (
          <p className="formMessage formError" role="alert">
            {error}
          </p>
        ) : null}

        <form action={signup} className="authForm">
          <label>
            이메일
            <input
              autoComplete="email"
              name="email"
              placeholder="you@example.com"
              required
              type="email"
            />
          </label>

          <label>
            비밀번호
            <input
              autoComplete="new-password"
              minLength={8}
              name="password"
              placeholder="8자 이상 입력"
              required
              type="password"
            />
          </label>

          <label>
            비밀번호 확인
            <input
              autoComplete="new-password"
              minLength={8}
              name="passwordConfirmation"
              placeholder="비밀번호를 다시 입력"
              required
              type="password"
            />
          </label>

          <button className="primaryAction authSubmit" type="submit">
            계정 만들기
          </button>
        </form>

        <p className="authFootnote">
          첫 MVP는 이메일과 비밀번호 로그인만 지원합니다.
        </p>
      </section>
    </main>
  );
}
