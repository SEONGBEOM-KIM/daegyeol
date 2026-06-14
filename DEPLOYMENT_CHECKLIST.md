# 배포 체크리스트

## 목적

`대신 결정해드립니다(대결)`을 온라인에 배포하기 전에 로컬 실행, 환경 변수, 비밀 정보, 데이터베이스, 로그, 롤백 방법을 점검한다.

첫 배포 목표는 실제 사용자에게 공개하기보다, 개발자가 직접 접속해 첫 화면과 이후 MVP 흐름을 검증할 수 있는 안전한 배포 상태를 만드는 것이다.

## 현재 배포 후보

기술 결정 문서 기준:

```text
Next.js + Supabase + OpenAI Responses API
```

권장 배포 방향:

```text
Vercel: Next.js 웹앱 배포
Supabase: Auth, PostgreSQL, 사용자 데이터 저장
OpenAI: 서버 측 추천 생성
```

## 배포 전에 반드시 결정할 것

다음 항목은 실제 배포 전에 사용자 확인이 필요하다.

- [ ] 배포 플랫폼을 Vercel로 확정할지
- [ ] Supabase 프로젝트를 새로 만들지, 기존 프로젝트를 사용할지
- [ ] 배포 URL을 공개할지, 개인 테스트용으로만 사용할지
- [ ] OpenAI API를 언제 연결할지
- [ ] 추천 기능을 실제 AI 호출로 만들지, 초기에는 더미 추천으로 시작할지
- [ ] 데이터베이스 테이블 구조를 확정할지
- [ ] Supabase Row Level Security 정책을 어떻게 둘지

## 로컬 배포 준비 체크

배포 전에 로컬에서 다음 명령이 성공해야 한다.

```bash
npm run test:m1
npm run build
```

확인 항목:

- [ ] 첫 화면 자동 검증 통과
- [ ] Next.js production build 성공
- [ ] TypeScript 오류 없음
- [ ] `.env.local`이 Git에 포함되지 않음
- [ ] `node_modules/`와 `.next/`가 Git에 포함되지 않음

## 환경 변수 구분

### 브라우저에 공개되어도 되는 값

Next.js에서 `NEXT_PUBLIC_`으로 시작하는 값은 브라우저에 노출된다.

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL
```

주의:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 이름에 `KEY`가 있어도 공개 가능한 anon key이다.
- 공개 가능한 키라도 Supabase RLS 정책이 잘못되어 있으면 데이터가 노출될 수 있다.

### 절대 브라우저에 노출하면 안 되는 값

다음 값은 서버 측에서만 사용한다.

```text
OPENAI_API_KEY
SUPABASE_SERVICE_ROLE_KEY
```

주의:

- `OPENAI_API_KEY`는 사용량과 비용이 연결되므로 절대 프론트엔드 코드에 넣지 않는다.
- `SUPABASE_SERVICE_ROLE_KEY`는 RLS를 우회할 수 있으므로 첫 MVP에서는 가능하면 사용하지 않는다.

## .env.local 작성 규칙

로컬 개발에서는 `.env.example`을 참고해 `.env.local`을 만든다.

```bash
cp .env.example .env.local
```

그 뒤 실제 값을 `.env.local`에만 입력한다.

금지:

- `.env.local`을 Git에 커밋하지 않는다.
- 채팅창에 실제 API 키를 붙여넣지 않는다.
- 브라우저 코드에서 `OPENAI_API_KEY`를 읽지 않는다.

## Supabase 배포 전 체크

Supabase를 연결하는 단계에서 확인할 항목:

- [ ] Auth 이메일 로그인 활성화
- [ ] 사용자별 데이터 테이블 설계
- [ ] 추천 요청 테이블 설계
- [ ] 추천 결과 테이블 설계
- [ ] 사용자 반응 테이블 설계
- [ ] Row Level Security 활성화
- [ ] 사용자는 자신의 데이터만 읽고 쓸 수 있음
- [ ] anon key로 다른 사용자 데이터에 접근할 수 없음

## OpenAI 연결 전 체크

OpenAI API를 연결하는 단계에서 확인할 항목:

- [ ] API 호출은 Next.js 서버 측 route handler에서 수행
- [ ] OpenAI API 키는 서버 환경 변수에서만 읽음
- [ ] 추천 결과는 구조화된 JSON 형태로 받음
- [ ] 추천 결과에 선택지 하나, 추천 이유, 제외 이유, 확신도가 포함됨
- [ ] API 실패 시 사용자에게 안전한 오류 메시지를 보여줌
- [ ] 비용이 과도하게 발생하지 않도록 요청 길이와 호출 횟수를 제한

## Vercel 배포 전 체크

- [ ] GitHub 저장소에 코드가 올라가 있음
- [ ] Vercel 프로젝트가 저장소와 연결됨
- [ ] 환경 변수가 Vercel Project Settings에 등록됨
- [ ] Preview 배포에서 `npm run build` 성공
- [ ] Production 배포 전에 Preview URL에서 화면 확인
- [ ] 배포 URL이 Supabase Auth Redirect URL에 등록됨

## 배포 후 확인

배포 후 브라우저에서 확인한다.

- [ ] 첫 화면이 열린다.
- [ ] 앱 이름이 보인다.
- [ ] 설명 문장이 보인다.
- [ ] 시작 버튼이 보인다.
- [ ] 모바일 크기에서 내용이 잘리지 않는다.
- [ ] 브라우저 콘솔에 치명적인 오류가 없다.

## 로그 확인

문제가 생기면 다음 순서로 확인한다.

1. Vercel build log
2. Vercel runtime log
3. Supabase Auth log
4. Supabase Database log
5. 브라우저 개발자 도구 Console / Network

## 롤백 기준

다음 문제가 있으면 배포를 롤백하거나 공개를 중단한다.

- 비밀 키 노출
- 다른 사용자의 데이터가 보임
- 회원가입 또는 로그인 불가
- 추천 요청 시 반복적인 서버 오류
- 배포 후 첫 화면 접근 불가

## Day 9 완료 기준

- 배포 전 확인할 환경 변수와 비밀 정보를 구분했다.
- 실제 배포 전에 결정해야 할 중요한 선택을 정리했다.
- 로컬 검증 명령을 문서화했다.
- 배포 후 확인 항목과 롤백 기준을 문서화했다.

