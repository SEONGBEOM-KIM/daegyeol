"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function redirectWithError(message: string): never {
  redirect(`/login?error=${encodeURIComponent(message)}`);
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !email.includes("@")) {
    redirectWithError("올바른 이메일 주소를 입력해주세요.");
  }

  if (!password) {
    redirectWithError("비밀번호를 입력해주세요.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (
      error.code === "invalid_credentials" ||
      error.message.toLowerCase().includes("invalid login credentials")
    ) {
      redirectWithError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    redirectWithError("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
  }

  redirect("/account");
}
