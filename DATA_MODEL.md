# M2 데이터 모델: 사용자 계정과 추천 기록 분리

## 목적

`대신 결정해드립니다(대결)` MVP에서 회원가입, 로그인, 성향 저장, 고민 입력, 추천 결과 저장을 위해 필요한 최소 데이터 구조를 정한다.

이번 단계에서는 코드를 작성하지 않는다. Supabase 기준으로 테이블 초안과 사용자별 데이터 분리 규칙을 문서화한다.

## 핵심 원칙

- 이메일은 로그인 식별자로 사용한다.
- 비밀번호는 앱 데이터베이스에 직접 저장하지 않는다.
- 비밀번호 저장과 인증은 Supabase Auth가 담당한다.
- 앱에서 직접 다루는 사용자 데이터는 Supabase Auth의 사용자 ID를 기준으로 연결한다.
- 모든 개인 데이터는 `user_id`로 소유자를 구분한다.
- 사용자는 자신의 데이터만 읽고 쓸 수 있어야 한다.

## Supabase Auth와 users 구분

Supabase에서는 회원가입한 사용자가 기본적으로 `auth.users`에 저장된다.

이 프로젝트에서 말하는 `users`는 별도 앱 테이블을 직접 만들기보다, Supabase가 제공하는 `auth.users`를 사용자 원본으로 사용한다.

```text
auth.users
```

역할:

- 이메일 저장
- 비밀번호 해시 저장
- 로그인 세션 관리
- 사용자 고유 ID 제공

주의:

- 앱 코드에서 비밀번호 원문을 저장하지 않는다.
- `auth.users.id`를 다른 테이블의 `user_id`로 참조한다.

## 테이블 초안

### 1. users

실제 구현에서는 별도 `public.users` 테이블을 만들지 않고, Supabase Auth의 `auth.users`를 사용한다.

| 필드 | 설명 |
|---|---|
| id | Supabase Auth가 생성하는 사용자 ID |
| email | 로그인 이메일 |
| encrypted_password | Supabase Auth 내부에서 관리하는 비밀번호 해시 |
| created_at | 가입 시각 |

앱에서 직접 조회해야 하는 공개 프로필 정보는 `profiles`에 저장한다.

### 2. profiles

사용자의 앱 전용 프로필과 성향 요약을 저장한다.

| 필드 | 타입 예시 | 설명 |
|---|---|---|
| id | uuid | 프로필 ID |
| user_id | uuid | `auth.users.id` 참조 |
| display_name | text | 표시 이름, 첫 MVP에서는 선택 |
| preference_summary | text | 사전 성향 질문 답변을 요약한 내용 |
| onboarding_completed | boolean | 사전 성향 질문 완료 여부 |
| created_at | timestamptz | 생성 시각 |
| updated_at | timestamptz | 수정 시각 |

관계:

```text
profiles.user_id → auth.users.id
```

규칙:

- 사용자 1명은 프로필 1개를 가진다.
- `profiles.user_id`는 중복될 수 없다.

### 3. decisions

사용자가 입력한 고민 또는 결정 요청을 저장한다.

| 필드 | 타입 예시 | 설명 |
|---|---|---|
| id | uuid | 결정 요청 ID |
| user_id | uuid | 소유 사용자 ID |
| title | text | 고민 제목 또는 질문 |
| category | text | 음식, 상품, 여행지 등 사용자가 입력하거나 앱이 추정한 분야 |
| context | text | 사용자가 추가로 입력한 상황 설명 |
| status | text | `draft`, `recommended`, `accepted`, `retry_requested` 등 |
| created_at | timestamptz | 생성 시각 |
| updated_at | timestamptz | 수정 시각 |

관계:

```text
decisions.user_id → auth.users.id
```

규칙:

- 모든 고민은 반드시 하나의 사용자에게 속한다.
- 사용자는 자신의 `decisions`만 조회할 수 있다.

### 4. options

각 고민에 포함된 선택지를 저장한다.

| 필드 | 타입 예시 | 설명 |
|---|---|---|
| id | uuid | 선택지 ID |
| decision_id | uuid | 연결된 고민 ID |
| user_id | uuid | 소유 사용자 ID |
| label | text | 선택지 이름 |
| description | text | 선택지 설명, 선택 |
| sort_order | integer | 화면 표시 순서 |
| created_at | timestamptz | 생성 시각 |

관계:

```text
options.decision_id → decisions.id
options.user_id → auth.users.id
```

규칙:

- 하나의 `decision`에는 선택지가 2개 이상 있어야 추천을 요청할 수 있다.
- `options.user_id`는 연결된 `decision.user_id`와 같아야 한다.

왜 `options`에도 `user_id`를 두는가?

- Row Level Security 정책을 단순하게 만들 수 있다.
- 선택지 테이블만 조회할 때도 사용자 소유권을 바로 확인할 수 있다.

### 5. recommendations

앱이 생성한 추천 결과와 사용자 반응을 저장한다.

| 필드 | 타입 예시 | 설명 |
|---|---|---|
| id | uuid | 추천 결과 ID |
| decision_id | uuid | 연결된 고민 ID |
| user_id | uuid | 소유 사용자 ID |
| selected_option_id | uuid | 추천한 선택지 ID |
| reason | text | 추천 이유 |
| rejection_reasons | jsonb | 나머지 선택지를 고르지 않은 이유 |
| confidence | integer | 추천 확신도, 0~100 |
| user_feedback | text | `accepted`, `retry_requested`, `none` |
| created_at | timestamptz | 생성 시각 |

관계:

```text
recommendations.decision_id → decisions.id
recommendations.user_id → auth.users.id
recommendations.selected_option_id → options.id
```

규칙:

- 추천 결과는 반드시 하나의 고민에 속한다.
- 추천된 선택지는 해당 고민의 선택지 중 하나여야 한다.
- `user_feedback = accepted`이면 추천을 채택한 것으로 본다.
- `user_feedback = retry_requested`이면 추천을 채택하지 않은 것으로 본다.

## 성향 질문 답변 저장 방식

첫 MVP에서는 별도 테이블을 만들지 않고 `profiles.preference_summary`에 요약본을 저장하는 방식으로 시작한다.

이유:

- M2의 목표는 최소 사용자 계정 모델을 정하는 것이다.
- 사전 질문 문항이 아직 확정되지 않았다.
- 처음부터 질문/답변 테이블을 만들면 범위가 커진다.

추후 확장 시 다음 테이블을 추가할 수 있다.

```text
preference_answers
```

예상 필드:

- id
- user_id
- question_key
- question_text
- answer
- created_at
- updated_at

## 채택률 계산

채택률은 `recommendations`에서 계산한다.

```text
채택률 = accepted 추천 수 ÷ accepted 또는 retry_requested 추천 수 × 100
```

예시:

```text
accepted = 7
retry_requested = 3
채택률 = 7 ÷ 10 × 100 = 70%
```

주의:

- `user_feedback = none`인 추천은 아직 반응하지 않은 상태이므로 계산에서 제외한다.

## 사용자별 데이터 분리 규칙

### 기본 규칙

모든 앱 데이터 테이블은 `user_id`를 가진다.

```text
profiles.user_id
decisions.user_id
options.user_id
recommendations.user_id
```

사용자는 다음 조건을 만족하는 데이터만 읽고 쓸 수 있다.

```text
row.user_id = auth.uid()
```

여기서 `auth.uid()`는 현재 로그인한 Supabase 사용자 ID이다.

### 사용자 A/B 데이터 분리 예시

```text
사용자 A id = aaa
사용자 B id = bbb
```

사용자 A가 만든 고민:

```text
decisions.id = d1
decisions.user_id = aaa
```

사용자 B가 로그인했을 때:

```text
auth.uid() = bbb
```

조회 조건:

```text
decisions.user_id = auth.uid()
```

결과:

```text
aaa != bbb
```

따라서 사용자 B는 사용자 A의 고민을 볼 수 없다.

## 추천 요청 생성 흐름

1. 로그인한 사용자의 `auth.users.id`를 확인한다.
2. `profiles`에 성향 요약이 있는지 확인한다.
3. 사용자가 고민을 입력하면 `decisions`에 저장한다.
4. 선택지를 `options`에 저장한다.
5. 선택지가 2개 이상이면 추천을 생성할 수 있다.
6. 추천 결과를 `recommendations`에 저장한다.
7. 사용자가 추천을 채택하거나 다시 추천을 요청하면 `recommendations.user_feedback`을 갱신한다.

## M2 완료 기준 확인

- 이메일은 Supabase Auth의 로그인 식별자로 사용한다.
- 비밀번호는 Supabase Auth가 안전하게 관리하고 앱 테이블에 직접 저장하지 않는다.
- 사용자별 추천 기록은 `user_id = auth.uid()` 규칙으로 분리한다.
- 사용자 A와 사용자 B의 `decisions`, `options`, `recommendations`는 `user_id`가 다르므로 섞이지 않는다.

## 다음 단계

다음 작업은 `M3. 회원가입 구현`이다.

M3에 들어가기 전에 다음 결정을 확인해야 한다.

- Supabase 프로젝트를 실제로 생성한다.
- 현재는 이메일/비밀번호 로그인만 사용한다.
- 회원가입 직후 `profiles` row를 자동 생성한다.

관련 설정 절차는 `SUPABASE_SETUP.md`에 기록한다.
