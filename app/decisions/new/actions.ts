"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function redirectWithError(message: string): never {
  redirect(`/decisions/new?error=${encodeURIComponent(message)}`);
}

export async function createDecision(formData: FormData) {
  const supabase = await createClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !data?.claims?.sub) {
    redirect(
      `/login?error=${encodeURIComponent(
        "고민을 저장하려면 먼저 로그인해주세요.",
      )}`,
    );
  }

  const title = String(formData.get("title") ?? "").trim();
  const context = String(formData.get("context") ?? "").trim();
  const options = formData
    .getAll("options")
    .map((option) => String(option).trim())
    .filter(Boolean);

  if (title.length < 2 || title.length > 120) {
    redirectWithError("고민 제목은 2자 이상 120자 이하로 입력해주세요.");
  }

  if (options.length < 2) {
    redirectWithError("선택지를 2개 이상 입력해주세요.");
  }

  if (options.length > 6 || options.some((option) => option.length > 120)) {
    redirectWithError("선택지는 최대 6개이며 각각 120자 이하여야 합니다.");
  }

  const { error } = await supabase.rpc("create_decision_with_options", {
    decision_title: title,
    decision_context: context,
    option_labels: options,
  });

  if (error) {
    redirectWithError("고민을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.");
  }

  redirect(`/account?message=${encodeURIComponent("새 고민을 저장했습니다.")}`);
}
