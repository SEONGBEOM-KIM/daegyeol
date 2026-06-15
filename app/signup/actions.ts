"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function redirectWithError(message: string): never {
  redirect(`/signup?error=${encodeURIComponent(message)}`);
}

export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const passwordConfirmation = String(
    formData.get("passwordConfirmation") ?? "",
  );

  if (!email || !email.includes("@")) {
    redirectWithError("올바른 이메일 주소를 입력해주세요.");
  }

  if (password.length < 8) {
    redirectWithError("비밀번호는 8자 이상이어야 합니다.");
  }

  if (password !== passwordConfirmation) {
    redirectWithError("비밀번호 확인이 일치하지 않습니다.");
  }

  const supabase = await createClient();
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/confirm`,
    },
  });

  if (error) {
    if (
      error.code === "user_already_exists" ||
      error.message.toLowerCase().includes("already registered")
    ) {
      redirectWithError("이미 가입된 이메일입니다.");
    }

    redirectWithError("회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
  }

  if (!data.user) {
    redirectWithError("회원가입 결과를 확인할 수 없습니다.");
  }

  if (data.session) {
    redirect("/account");
  }

  redirect("/signup/success");
}
