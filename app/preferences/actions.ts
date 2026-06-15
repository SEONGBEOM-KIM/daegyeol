"use server";

import { redirect } from "next/navigation";
import {
  isValidPreferenceAnswer,
  preferenceQuestions,
  type PreferenceAnswers,
} from "@/lib/preferences";
import { createClient } from "@/lib/supabase/server";

function redirectWithError(message: string): never {
  redirect(`/preferences?error=${encodeURIComponent(message)}`);
}

export async function savePreferences(formData: FormData) {
  const supabase = await createClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !data?.claims?.sub) {
    redirect(
      `/login?error=${encodeURIComponent(
        "성향을 저장하려면 먼저 로그인해주세요.",
      )}`,
    );
  }

  const answers: PreferenceAnswers = {};

  for (const question of preferenceQuestions) {
    const answer = String(formData.get(question.key) ?? "");

    if (!isValidPreferenceAnswer(question, answer)) {
      redirectWithError("모든 성향 질문에 답해주세요.");
    }

    answers[question.key] = answer;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      preference_summary: JSON.stringify(answers),
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", data.claims.sub);

  if (error) {
    redirectWithError("성향을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.");
  }

  redirect(
    `/account?message=${encodeURIComponent("선택 성향을 저장했습니다.")}`,
  );
}
