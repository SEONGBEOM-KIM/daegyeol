import { readFile } from "node:fs/promises";

const page = await readFile("app/page.tsx", "utf8");
const css = await readFile("app/globals.css", "utf8");

const checks = [
  {
    name: "앱 이름이 첫 화면 코드에 있다",
    pass: page.includes("대신 결정해드립니다"),
  },
  {
    name: "앱 목적을 설명하는 문장이 있다",
    pass: page.includes("선택지가 많아 망설여질 때"),
  },
  {
    name: "시작하기 버튼이 있다",
    pass: page.includes("시작하기") && page.includes("primaryAction"),
  },
  {
    name: "앱 사용 흐름 3단계가 있다",
    pass:
      page.includes("고민 입력") &&
      page.includes("성향 반영") &&
      page.includes("하나 추천"),
  },
  {
    name: "모바일 화면을 위한 반응형 스타일이 있다",
    pass: css.includes("@media (max-width: 760px)"),
  },
  {
    name: "첫 화면 주요 스타일 클래스가 있다",
    pass:
      css.includes(".hero") &&
      css.includes(".summary") &&
      css.includes(".primaryAction"),
  },
];

let failed = 0;

for (const check of checks) {
  if (check.pass) {
    console.log(`OK: ${check.name}`);
  } else {
    failed += 1;
    console.error(`FAIL: ${check.name}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed}개 검증 실패`);
  process.exit(1);
}

console.log("\nM1 첫 화면 자동 검증 통과");
