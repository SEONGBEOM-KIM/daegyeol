import { readFile } from "node:fs/promises";

const files = {
  signupPage: await readFile("app/signup/page.tsx", "utf8"),
  signupAction: await readFile("app/signup/actions.ts", "utf8"),
  confirmRoute: await readFile("app/auth/confirm/route.ts", "utf8"),
  migration: await readFile(
    "supabase/migrations/202606120001_create_profiles.sql",
    "utf8",
  ),
  homePage: await readFile("app/page.tsx", "utf8"),
};

const checks = [
  ["회원가입 이메일 입력", files.signupPage.includes('name="email"')],
  ["비밀번호 입력", files.signupPage.includes('name="password"')],
  [
    "비밀번호 확인 입력",
    files.signupPage.includes('name="passwordConfirmation"'),
  ],
  ["Supabase signUp 호출", files.signupAction.includes("auth.signUp")],
  ["8자 비밀번호 검증", files.signupAction.includes("password.length < 8")],
  [
    "이메일 확인 콜백",
    files.confirmRoute.includes("exchangeCodeForSession") &&
      files.confirmRoute.includes("verifyOtp"),
  ],
  [
    "profiles 테이블",
    files.migration.includes("create table if not exists public.profiles"),
  ],
  [
    "profiles 사용자 고유 제약",
    files.migration.includes("user_id uuid not null unique"),
  ],
  [
    "profiles RLS",
    files.migration.includes("enable row level security") &&
      files.migration.includes("auth.uid()"),
  ],
  [
    "회원가입 시 프로필 자동 생성",
    files.migration.includes("handle_new_user") &&
      files.migration.includes("on_auth_user_created"),
  ],
  [
    "첫 화면 회원가입 연결",
    files.homePage.includes('href="/signup"'),
  ],
];

let failures = 0;

for (const [name, pass] of checks) {
  if (pass) {
    console.log(`OK: ${name}`);
  } else {
    failures += 1;
    console.error(`FAIL: ${name}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures}개 M3 검증 실패`);
  process.exit(1);
}

console.log("\nM3 회원가입 구조 자동 검증 통과");
