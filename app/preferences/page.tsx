import Link from "next/link";
import { redirect } from "next/navigation";
import {
  parsePreferenceAnswers,
  preferenceQuestions,
} from "@/lib/preferences";
import { createClient } from "@/lib/supabase/server";
import { savePreferences } from "./actions";

type PreferencesPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function PreferencesPage({
  searchParams,
}: PreferencesPageProps) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !data?.claims?.sub) {
    redirect(
      `/login?error=${encodeURIComponent(
        "성향 질문에 답하려면 먼저 로그인해주세요.",
      )}`,
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("preference_summary")
    .eq("user_id", data.claims.sub)
    .single();

  const savedAnswers = parsePreferenceAnswers(
    profile?.preference_summary ?? null,
  );

  return (
    <main className="preferencesPage">
      <section
        className="preferencesContainer"
        aria-labelledby="preferences-title"
      >
        <Link className="backLink" href="/account">
          ← 내 대결로
        </Link>

        <div className="preferencesHeading">
          <p className="eyebrow">나에게 맞는 추천 준비</p>
          <h1 id="preferences-title">선택 성향 알려주기</h1>
          <p>
            분야에 관계없이 사용할 수 있는 다섯 가지 기준입니다. 저장한
            답변은 언제든 다시 수정할 수 있습니다.
          </p>
        </div>

        {error ? (
          <p className="formMessage formError" role="alert">
            {error}
          </p>
        ) : null}

        <form action={savePreferences} className="preferencesForm">
          {preferenceQuestions.map((question, index) => (
            <fieldset className="preferenceQuestion" key={question.key}>
              <legend>
                <span>질문 {index + 1}</span>
                {question.title}
              </legend>
              <p>{question.description}</p>

              <div className="preferenceOptions">
                {question.options.map((option) => (
                  <label key={option.value}>
                    <input
                      defaultChecked={
                        savedAnswers[question.key] === option.value
                      }
                      name={question.key}
                      required
                      type="radio"
                      value={option.value}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          <button className="primaryAction preferencesSubmit" type="submit">
            성향 저장하기
          </button>
        </form>
      </section>
    </main>
  );
}
