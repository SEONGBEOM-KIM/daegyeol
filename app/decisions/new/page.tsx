import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createDecision } from "./actions";
import { OptionsFields } from "./options-fields";

type NewDecisionPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewDecisionPage({
  searchParams,
}: NewDecisionPageProps) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !data?.claims?.sub) {
    redirect(
      `/login?error=${encodeURIComponent(
        "고민을 입력하려면 먼저 로그인해주세요.",
      )}`,
    );
  }

  return (
    <main className="decisionPage">
      <section className="decisionContainer" aria-labelledby="decision-title">
        <Link className="backLink" href="/account">
          ← 내 대결로
        </Link>

        <div className="decisionHeading">
          <p className="eyebrow">새로운 대결</p>
          <h1 id="decision-title">무엇을 결정할까요?</h1>
          <p>
            지금 고민하는 질문과 직접 비교하고 싶은 선택지를 입력해주세요.
            추천 생성은 다음 단계에서 연결합니다.
          </p>
        </div>

        {error ? (
          <p className="formMessage formError" role="alert">
            {error}
          </p>
        ) : null}

        <form action={createDecision} className="decisionForm">
          <label className="decisionTextField">
            고민 또는 질문
            <input
              maxLength={120}
              name="title"
              placeholder="예: 오늘 점심 뭐 먹지?"
              required
              type="text"
            />
          </label>

          <label className="decisionTextField">
            상황 설명 <span>선택 사항</span>
            <textarea
              maxLength={1000}
              name="context"
              placeholder="예산, 현재 기분, 중요하게 보는 점 등을 적어주세요."
              rows={5}
            />
          </label>

          <OptionsFields />

          <button className="primaryAction decisionSubmit" type="submit">
            고민 저장하기
          </button>
        </form>
      </section>
    </main>
  );
}
