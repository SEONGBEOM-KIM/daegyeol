import { readFile } from "node:fs/promises";

const files = {
  loginPage: await readFile("app/login/page.tsx", "utf8"),
  loginAction: await readFile("app/login/actions.ts", "utf8"),
  accountPage: await readFile("app/account/page.tsx", "utf8"),
  accountAction: await readFile("app/account/actions.ts", "utf8"),
  proxy: await readFile("lib/supabase/proxy.ts", "utf8"),
  rootProxy: await readFile("proxy.ts", "utf8"),
  homePage: await readFile("app/page.tsx", "utf8"),
};

const checks = [
  ["로그인 이메일 입력", files.loginPage.includes('name="email"')],
  ["로그인 비밀번호 입력", files.loginPage.includes('name="password"')],
  [
    "Supabase 비밀번호 로그인",
    files.loginAction.includes("auth.signInWithPassword"),
  ],
  [
    "잘못된 로그인 정보 오류",
    files.loginAction.includes("invalid_credentials"),
  ],
  [
    "보호 페이지 인증 확인",
    files.accountPage.includes("auth.getClaims") &&
      files.accountPage.includes('redirect('),
  ],
  ["Supabase 로그아웃", files.accountAction.includes("auth.signOut")],
  [
    "로그아웃 후 로그인 화면 이동",
    files.accountAction.includes('redirect(') &&
      files.accountAction.includes("/login"),
  ],
  [
    "세션 갱신 Proxy",
    files.proxy.includes("auth.getClaims") &&
      files.proxy.includes("response.cookies.set"),
  ],
  ["Next.js Proxy 연결", files.rootProxy.includes("updateSession")],
  ["첫 화면 로그인 연결", files.homePage.includes('href="/login"')],
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
  console.error(`\n${failures}개 M4 검증 실패`);
  process.exit(1);
}

console.log("\nM4 로그인·로그아웃 구조 자동 검증 통과");
