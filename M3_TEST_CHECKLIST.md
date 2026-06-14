# M3 회원가입 검증 체크리스트

## 자동 검증

```bash
npm run test:m3
npm run build
```

## Supabase 스키마 준비

`supabase/migrations/202606120001_create_profiles.sql`을 Supabase 프로젝트에 적용한다.

확인:

- [ ] `public.profiles` 테이블이 있다.
- [ ] `profiles.user_id`가 `auth.users.id`를 참조한다.
- [ ] RLS가 활성화되어 있다.
- [ ] 사용자는 자신의 프로필만 조회·수정할 수 있다.
- [ ] `on_auth_user_created` 트리거가 있다.

## 브라우저 수동 검증

```bash
npm run dev
```

1. `http://localhost:3000`에 접속한다.
2. `시작하기`를 눌러 `/signup`으로 이동한다.
3. 잘못된 이메일을 입력하면 오류가 보이는지 확인한다.
4. 8자 미만 비밀번호가 거부되는지 확인한다.
5. 비밀번호 확인이 다르면 오류가 보이는지 확인한다.
6. 새 이메일로 가입한다.
7. Supabase Auth 사용자 목록에 사용자가 생겼는지 확인한다.
8. `profiles`에 동일한 `user_id` row가 자동 생성됐는지 확인한다.
9. 같은 이메일로 다시 가입할 때 안전한 안내가 보이는지 확인한다.

## 완료 기준

- 새 이메일로 가입 요청이 성공한다.
- 회원가입 직후 `profiles` row가 자동 생성된다.
- 비밀번호 원문을 앱 데이터베이스에 저장하지 않는다.
- 기존 이메일과 잘못된 입력을 안전하게 처리한다.
