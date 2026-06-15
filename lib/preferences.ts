export type PreferenceAnswers = Record<string, string>;

export type PreferenceQuestion = {
  key: string;
  title: string;
  description: string;
  options: {
    value: string;
    label: string;
  }[];
};

export const preferenceQuestions: PreferenceQuestion[] = [
  {
    key: "priority",
    title: "선택할 때 가장 중요하게 보는 것은 무엇인가요?",
    description: "분야와 관계없이 평소 가장 먼저 확인하는 기준을 골라주세요.",
    options: [
      { value: "value", label: "가격 대비 만족도" },
      { value: "quality", label: "품질과 성능" },
      { value: "experience", label: "새롭고 특별한 경험" },
    ],
  },
  {
    key: "risk",
    title: "익숙한 선택과 새로운 선택 중 어느 쪽을 선호하나요?",
    description: "음식, 상품, 여행지에서 평소 보이는 성향을 생각해주세요.",
    options: [
      { value: "safe", label: "검증되고 익숙한 선택" },
      { value: "balanced", label: "상황에 따라 균형 있게" },
      { value: "adventurous", label: "새롭고 도전적인 선택" },
    ],
  },
  {
    key: "budget",
    title: "예산과 만족도가 충돌하면 어떻게 선택하나요?",
    description: "더 좋은 선택을 위해 추가 비용을 낼 의향을 묻는 질문입니다.",
    options: [
      { value: "strict", label: "정해둔 예산을 우선 지킨다" },
      { value: "flexible", label: "납득할 이유가 있으면 조금 더 쓴다" },
      { value: "premium", label: "만족도가 높다면 비용을 더 낸다" },
    ],
  },
  {
    key: "convenience",
    title: "편리함과 특별함 중 무엇에 더 끌리나요?",
    description: "시간과 노력을 줄이는 것과 특별한 경험 사이의 기준입니다.",
    options: [
      { value: "convenient", label: "빠르고 편리한 선택" },
      { value: "balanced", label: "편리함과 특별함의 균형" },
      { value: "memorable", label: "수고가 들더라도 특별한 선택" },
    ],
  },
  {
    key: "decision_style",
    title: "결정을 내릴 때 어떤 설명이 가장 도움이 되나요?",
    description: "앞으로 추천 이유를 제시할 때 활용합니다.",
    options: [
      { value: "concise", label: "결론과 핵심 이유만 간단히" },
      { value: "comparison", label: "선택지별 장단점을 비교해서" },
      { value: "confident", label: "망설이지 않도록 단호하게" },
    ],
  },
];

export function parsePreferenceAnswers(
  preferenceSummary: string | null,
): PreferenceAnswers {
  if (!preferenceSummary) {
    return {};
  }

  try {
    const parsed = JSON.parse(preferenceSummary);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as PreferenceAnswers)
      : {};
  } catch {
    return {};
  }
}

export function isValidPreferenceAnswer(
  question: PreferenceQuestion,
  answer: string,
) {
  return question.options.some((option) => option.value === answer);
}
