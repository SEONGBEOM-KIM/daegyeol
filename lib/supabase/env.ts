export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase 환경 변수가 없습니다. NEXT_PUBLIC_SUPABASE_URL과 publishable key를 확인하세요.",
    );
  }

  return { url, publishableKey };
}
