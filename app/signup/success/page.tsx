import Link from "next/link";

export default function SignupSuccessPage() {
  return (
    <main className="authPage">
      <section className="authCard authResult" aria-labelledby="success-title">
        <p className="resultIcon" aria-hidden="true">
          ✓
        </p>
        <h1 id="success-title">가입 요청이 완료됐습니다</h1>
        <p>
          이메일 확인이 켜져 있다면 받은 편지함에서 인증 링크를 눌러주세요.
          인증을 마치면 로그인 기능을 구현한 다음 단계에서 계정을 사용할 수
          있습니다.
        </p>
        <Link className="primaryAction" href="/">
          첫 화면으로 돌아가기
        </Link>
      </section>
    </main>
  );
}
