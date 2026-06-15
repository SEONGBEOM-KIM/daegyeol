import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

type AccountPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const { message } = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect(
      `/login?error=${encodeURIComponent(
        "개인 화면을 보려면 먼저 로그인해주세요.",
      )}`,
    );
  }

  const email =
    typeof data.claims.email === "string"
      ? data.claims.email
      : "로그인한 사용자";

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("user_id", data.claims.sub)
    .single();

  const preferencesCompleted = profile?.onboarding_completed === true;

  const { data: decisions } = await supabase
    .from("decisions")
    .select("id, title, status, created_at")
    .eq("user_id", data.claims.sub)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="authPage">
      <section className="authCard accountCard" aria-labelledby="account-title">
        <div className="authHeading">
          <p className="eyebrow">보호된 개인 화면</p>
          <h1 id="account-title">내 대결</h1>
          <p>
            <strong>{email}</strong> 계정으로 로그인되어 있습니다.
          </p>
        </div>

        {message ? (
          <p className="formMessage formSuccess" role="status">
            {message}
          </p>
        ) : null}

        <div className="accountNotice">
          <h2>
            {preferencesCompleted
              ? "선택 성향이 저장되어 있습니다"
              : "먼저 선택 성향을 알려주세요"}
          </h2>
          <p>
            {preferencesCompleted
              ? "저장한 답변은 다음 추천부터 활용되며 언제든 수정할 수 있습니다."
              : "다섯 가지 공통 질문에 답하면 다음 단계에서 더 개인화된 추천을 받을 수 있습니다."}
          </p>
          <Link className="primaryAction accountPreferenceLink" href="/preferences">
            {preferencesCompleted ? "성향 수정하기" : "성향 질문 시작하기"}
          </Link>
        </div>

        <section className="decisionSummary" aria-labelledby="decision-list-title">
          <div className="decisionSummaryHeading">
            <div>
              <p className="sectionLabel">나의 고민</p>
              <h2 id="decision-list-title">최근 저장한 고민</h2>
            </div>
            <Link className="primaryAction" href="/decisions/new">
              + 새 고민
            </Link>
          </div>

          {decisions && decisions.length > 0 ? (
            <ul className="decisionList">
              {decisions.map((decision) => (
                <li key={decision.id}>
                  <strong>{decision.title}</strong>
                  <span>
                    {decision.status === "draft" ? "추천 전" : decision.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="emptyState">
              저장한 고민이 없습니다. 첫 고민과 선택지를 입력해보세요.
            </p>
          )}
        </section>

        <div className="accountActions">
          <Link className="secondaryAction" href="/">
            첫 화면
          </Link>
          <form action={logout}>
            <button className="primaryAction authSubmit" type="submit">
              로그아웃
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
