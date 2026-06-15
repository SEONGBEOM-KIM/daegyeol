import { readFile } from "node:fs/promises";

const files = {
  migration: await readFile(
    "supabase/migrations/202606150001_create_decisions_and_options.sql",
    "utf8",
  ),
  page: await readFile("app/decisions/new/page.tsx", "utf8"),
  options: await readFile("app/decisions/new/options-fields.tsx", "utf8"),
  action: await readFile("app/decisions/new/actions.ts", "utf8"),
  account: await readFile("app/account/page.tsx", "utf8"),
};

const checks = [
  [
    "decisions와 options 테이블",
    files.migration.includes("create table if not exists public.decisions") &&
      files.migration.includes("create table if not exists public.options"),
  ],
  [
    "사용자별 RLS",
    files.migration.includes("enable row level security") &&
      files.migration.includes("auth.uid()"),
  ],
  [
    "고민과 선택지 소유자 일치",
    files.migration.includes("foreign key (decision_id, user_id)"),
  ],
  [
    "원자적 고민 저장 함수",
    files.migration.includes("create_decision_with_options"),
  ],
  ["고민 제목 입력", files.page.includes('name="title"')],
  ["상황 설명 입력", files.page.includes('name="context"')],
  [
    "선택지 최소 2개",
    files.options.includes("minimumOptions = 2") &&
      files.action.includes("options.length < 2"),
  ],
  [
    "선택지 추가와 삭제",
    files.options.includes("addOption") &&
      files.options.includes("removeOption"),
  ],
  [
    "로그인 사용자만 저장",
    files.action.includes("auth.getClaims") &&
      files.page.includes("auth.getClaims"),
  ],
  [
    "계정 화면 고민 목록과 진입 링크",
    files.account.includes('.from("decisions")') &&
      files.account.includes('href="/decisions/new"'),
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
  console.error(`\n${failures}개 M6 검증 실패`);
  process.exit(1);
}

console.log("\nM6 고민·선택지 입력 구조 자동 검증 통과");
