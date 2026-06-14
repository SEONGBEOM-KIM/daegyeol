# Supabase 설정 계획

## 목적

M3 회원가입 구현 전에 Supabase 프로젝트와 인증 방식을 준비한다.

## 확정된 결정

- Supabase 프로젝트를 실제로 만든다.
- 첫 MVP에서는 이메일/비밀번호 로그인만 사용한다.
- 회원가입 직후 `profiles` row를 자동 생성한다.

## Supabase 프로젝트 생성 시 결정할 값

Supabase 대시보드에서 프로젝트를 만들 때 다음 값이 필요하다.

| 항목 | 결정 |
|---|---|
| Organization | 사용자의 Supabase 계정에서 선택 |
| Project name | `daegyeol` 권장 |
| Database password | 강한 비밀번호 사용, 문서/채팅에 기록하지 않음 |
| Region | 사용자가 주로 접속할 지역과 가까운 곳 선택 |
| Pricing plan | 첫 MVP는 무료 플랜으로 시작 권장 |

## 환경 변수

프로젝트 생성 후 Supabase 대시보드에서 다음 값을 확인한다.

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

로컬에서는 `.env.example`을 복사해 `.env.local`을 만든 뒤 실제 값을 넣는다.

```bash
cp .env.example .env.local
```

주의:

- `.env.local`은 Git에 커밋하지 않는다.
- `SUPABASE_SERVICE_ROLE_KEY`는 첫 MVP 회원가입 구현에는 사용하지 않는다.

## 인증 방식

첫 MVP에서는 이메일/비밀번호 로그인만 사용한다.

포함:

- 이메일 회원가입
- 비밀번호 로그인
- 로그아웃

제외:

- Google 로그인
- Kakao 로그인
- GitHub 로그인
- 비밀번호 찾기
- 이메일 템플릿 커스터마이징

## profiles 자동 생성 전략

회원가입 직후 앱에서 `profiles` row를 생성한다.

초기 프로필 값:

```text
user_id = 현재 로그인한 사용자 ID
display_name = null
preference_summary = null
onboarding_completed = false
```

목표:

- 회원가입한 사용자는 반드시 `profiles` row를 하나 가진다.
- `profiles.user_id`는 `auth.users.id`와 연결된다.
- 같은 사용자에게 프로필이 중복 생성되지 않는다.

## M3 구현 전 확인할 체크리스트

- [ ] Supabase 프로젝트가 생성되어 있다.
- [ ] `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`이 있다.
- [ ] `.env.local`에 `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 있다.
- [ ] 이메일/비밀번호 Auth가 활성화되어 있다.
- [ ] `profiles` 테이블 생성 SQL을 작성할 준비가 되어 있다.
- [ ] RLS 정책은 사용자가 자신의 프로필만 접근하도록 설계한다.

## 다음 작업

M3에서는 다음 순서로 진행한다.

1. Supabase 클라이언트 패키지 설치
2. 환경 변수 읽기 설정
3. 회원가입 화면 작성
4. 이메일/비밀번호 회원가입 호출
5. 회원가입 성공 후 `profiles` row 생성
6. 중복 이메일 오류 처리
7. 빌드와 수동 회원가입 테스트

