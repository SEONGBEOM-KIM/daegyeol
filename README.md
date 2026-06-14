# 대신 결정해드립니다

선택에 어려움을 느끼는 사용자를 위해, 개인 성향과 현재 고민을 바탕으로 하나의 선택지를 이유와 함께 추천하는 웹앱입니다.

## 기준 문서

- `PROJECT_BRIEF.md` — 프로젝트 목적과 MVP 범위
- `TASKS.md` — Must / Should / Later 작업 분해
- `TECH_DECISION.md` — 기술 선택 이유
- `AGENTS.md` — AI 작업 규칙
- `HARNESS.md` — AI와 반복적으로 기능을 개발하는 절차
- `RETROSPECTIVE.md` — 10일 학습 회고와 다음 학습 주제
- `DEPLOYMENT_CHECKLIST.md` — 배포 전후 점검 항목

## 기술 스택

```text
Next.js
Supabase
OpenAI Responses API
```

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 확인합니다.

```text
http://localhost:3000
```

## 검증

첫 화면 자동 검증:

```bash
npm run test:m1
```

회원가입 구조 자동 검증:

```bash
npm run test:m3
```

프로덕션 빌드 검증:

```bash
npm run build
```

## 환경 변수

`.env.example`을 복사해 `.env.local`을 만듭니다.

```bash
cp .env.example .env.local
```

실제 API 키는 `.env.local`에만 입력합니다.

주의:

- `.env.local`은 커밋하지 않습니다.
- `OPENAI_API_KEY`는 브라우저 코드에서 사용하지 않습니다.
- `SUPABASE_SERVICE_ROLE_KEY`는 첫 MVP에서 가능하면 사용하지 않습니다.

## 배포 전 확인

실제 배포 전에는 `DEPLOYMENT_CHECKLIST.md`를 확인합니다.
