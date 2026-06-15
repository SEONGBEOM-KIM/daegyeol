import { readFile } from "node:fs/promises";

const files = {
  preferences: await readFile("lib/preferences.ts", "utf8"),
  page: await readFile("app/preferences/page.tsx", "utf8"),
  action: await readFile("app/preferences/actions.ts", "utf8"),
  account: await readFile("app/account/page.tsx", "utf8"),
  dataModel: await readFile("DATA_MODEL.md", "utf8"),
};

const questionCount = (
  files.preferences.match(/title: "/g) ?? []
).length;

const checks = [
  ["공통 성향 질문 최소 5개", questionCount >= 5],
  [
    "질문별 선택 답변",
    files.page.includes('type="radio"') &&
      files.page.includes("preferenceQuestions.map"),
  ],
  [
    "모든 질문 필수 입력",
    files.page.includes("required") &&
      files.action.includes("모든 성향 질문에 답해주세요"),
  ],
  [
    "로그인 사용자 확인",
    files.action.includes("auth.getClaims") &&
      files.page.includes("auth.getClaims"),
  ],
  [
    "사용자별 profiles 저장",
    files.action.includes('.from("profiles")') &&
      files.action.includes('.eq("user_id", data.claims.sub)'),
  ],
  [
    "성향 완료 상태 저장",
    files.action.includes("onboarding_completed: true"),
  ],
  [
    "기존 답변 재표시",
    files.page.includes("parsePreferenceAnswers") &&
      files.page.includes("defaultChecked"),
  ],
  [
    "계정 화면 성향 링크",
    files.account.includes('href="/preferences"'),
  ],
  [
    "데이터 모델 저장 형식 기록",
    files.dataModel.includes("JSON 문자열"),
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
  console.error(`\n${failures}개 M5 검증 실패`);
  process.exit(1);
}

console.log("\nM5 사전 성향 질문 구조 자동 검증 통과");
