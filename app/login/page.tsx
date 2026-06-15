import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { login } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    redirect("/account");
  }

  return (
    <main className="authPage">
      <section className="authCard" aria-labelledby="login-title">
        <Link className="backLink" href="/">
          ← 첫 화면으로
        </Link>

        <div className="authHeading">
          <p className="eyebrow">다시 만나서 반갑습니다</p>
          <h1 id="login-title">로그인</h1>
          <p>가입한 이메일과 비밀번호로 개인화된 대결을 이어가세요.</p>
        </div>

        {error ? (
          <p className="formMessage formError" role="alert">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="formMessage formSuccess" role="status">
            {message}
          </p>
        ) : null}

        <form action={login} className="authForm">
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
              autoComplete="current-password"
              name="password"
              placeholder="비밀번호 입력"
              required
              type="password"
            />
          </label>

          <button className="primaryAction authSubmit" type="submit">
            로그인
          </button>
        </form>

        <p className="authFootnote">
          아직 계정이 없나요?{" "}
          <Link className="textLink" href="/signup">
            회원가입
          </Link>
        </p>
      </section>
    </main>
  );
}
