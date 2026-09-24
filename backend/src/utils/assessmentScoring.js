export const domains = [
  'Emotional Health',
  'Stress & Anxiety',
  'Sleep & Energy',
  'Social Connection',
  'Daily Functioning'
];

const questionDomains = {
  1: 'Emotional Health',
  2: 'Emotional Health',
  3: 'Emotional Health',
  4: 'Emotional Health',
  5: 'Emotional Health',
  6: 'Emotional Health',

  7: 'Stress & Anxiety',
  8: 'Stress & Anxiety',
  9: 'Stress & Anxiety',
  10: 'Stress & Anxiety',
  11: 'Stress & Anxiety',
  12: 'Stress & Anxiety',

  13: 'Sleep & Energy',
  14: 'Sleep & Energy',
  15: 'Sleep & Energy',
  16: 'Sleep & Energy',
  17: 'Sleep & Energy',

  18: 'Social Connection',
  19: 'Social Connection',
  20: 'Social Connection',
  21: 'Social Connection',
  22: 'Social Connection',

  23: 'Daily Functioning',
  24: 'Daily Functioning',
  25: 'Daily Functioning',
  26: 'Daily Functioning',
  27: 'Daily Functioning'
};

export function calculateAssessment(
  answers
) {
  if (
    !answers ||
    typeof answers !== 'object'
  ) {
    throw new Error(
      'Assessment answers are required.'
    );
  }

  const expectedQuestionIds =
    Array.from(
      { length: 27 },
      (_, index) => index + 1
    );

  for (
    const questionId
    of expectedQuestionIds
  ) {
    const answer =
      answers[questionId];

    if (
      answer === undefined ||
      !Number.isInteger(answer) ||
      answer < 0 ||
      answer > 4
    ) {
      throw new Error(
        `Invalid or missing answer for question ${questionId}.`
      );
    }
  }

  const domainScores = {
    'Emotional Health': 0,
    'Stress & Anxiety': 0,
    'Sleep & Energy': 0,
    'Social Connection': 0,
    'Daily Functioning': 0
  };

  let totalScore = 0;

  for (
    const questionId
    of expectedQuestionIds
  ) {
    const value =
      answers[questionId];

    const domain =
      questionDomains[questionId];

    totalScore += value;

    domainScores[domain] += value;
  }

  let riskLevel;

  if (totalScore <= 35) {
    riskLevel = 'No Risk';
  } else if (
    totalScore <= 70
  ) {
    riskLevel = 'Borderline';
  } else {
    riskLevel = 'At Risk';
  }

  return {
    totalScore,
    domainScores,
    riskLevel
  };
}