// Source questionnaire: https://form.jotform.com/253097599199883
// The public form does not expose its scoring formulas. Keep automated scoring
// disabled until Centre for Effective Serving supplies approved scoring rules.
export const questionnaireTitle = 'Tune In Emotional Health Check';
export const questionnaireVersion = 'v2 – Beta';

const makeOptions = (labels) => labels.map((label, index) => ({ label, value: String(index) }));

const yesNoOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' }
];

const monthlyFrequency = makeOptions([
  'Never', 'Once or twice', 'About once a week',
  'Two or three times a week', 'Almost every day', 'Every day'
]);
const experienceScale = makeOptions([
  'Not at all', 'Very little', 'A little', 'Somewhat',
  'Quite a bit', 'Very much', 'Completely'
]);
const agreementScale = makeOptions([
  'Strongly disagree', 'Disagree', 'Somewhat disagree', 'Neutral',
  'Somewhat agree', 'Agree', 'Strongly agree'
]);
const twoWeekFrequency = makeOptions([
  'Not at all', 'Several days', 'More than half the days', 'Nearly every day'
]);
const ministryFrequency = makeOptions(['Never', 'Rarely', 'Sometimes', 'Often', 'Always']);

function matrixSection({ id, title, shortTitle, prompt, options, items }) {
  return {
    id, title, shortTitle, category: 'assessment',
    questions: items.map((text, index) => ({
      id: `${id}_${index + 1}`, type: 'radio', text, prompt, options, required: true
    }))
  };
}

function checklistSection({ id, title, shortTitle, prompt, options, required = true }) {
  return {
    id, title, shortTitle, category: 'assessment',
    questions: [{
      id,
      type: 'checkbox',
      text: prompt,
      options: options.map((label, index) => ({
        label,
        value: label === 'None of these apply to me' ? 'none' : String(index)
      })),
      required,
      exclusiveOption: options.includes('None of these apply to me') ? 'none' : null
    }]
  };
}

export const assessmentSections = [
  {
    id: 'profile',
    title: 'About You',
    shortTitle: 'About You',
    category: 'profile',
    includeInResults: false,
    questions: [
      {
        id: 'profile_ministry_position', type: 'text',
        text: 'What is your ministry position?', placeholder: 'Enter your role or position', required: true
      },
      {
        id: 'profile_send_copy', type: 'radio',
        text: 'Would you like your results sent to someone else, too?',
        options: yesNoOptions, required: true
      },
      {
        id: 'profile_recipient_name', type: 'text',
        text: 'What is the name of the person who should receive a copy?',
        placeholder: 'Recipient name', required: true,
        showWhen: { questionId: 'profile_send_copy', equals: 'yes' }
      },
      {
        id: 'profile_recipient_email', type: 'email',
        text: 'What is their email address?', placeholder: 'recipient@example.com', required: true,
        showWhen: { questionId: 'profile_send_copy', equals: 'yes' }
      },
      {
        id: 'profile_recipient_relationship', type: 'text',
        text: 'What is their relationship to you?',
        placeholder: 'For example: supervisor, mentor or partner', required: true,
        showWhen: { questionId: 'profile_send_copy', equals: 'yes' }
      },
      {
        id: 'profile_mailing_consent', type: 'radio',
        text: 'Do you consent to being subscribed to the Centre for Effective Serving mailing list?',
        options: yesNoOptions, required: true
      }
    ]
  },
  matrixSection({
    id: 'q1', title: '1. General Happiness', shortTitle: 'General Happiness',
    prompt: 'During the past month, how often did you feel…', options: monthlyFrequency,
    items: ['Happy', 'Interested in life', 'Satisfied with life']
  }),
  matrixSection({
    id: 'q1a', title: '1a. General Wellbeing', shortTitle: 'General Wellbeing',
    prompt: 'During the past month, how often did you feel the following? These general wellbeing items do not reflect a particular theological view.',
    options: monthlyFrequency,
    items: [
      'That you had something important to contribute to society',
      'That you belonged to a community',
      'That our society is a good place, becoming a better place, for all people',
      'That people are basically good',
      'That the way our society works makes sense to you',
      'That you liked most parts of your daily life',
      'Good at managing the responsibilities of your daily life',
      'That you had experiences that challenged you to grow and become a better person',
      'Confident to think or express your own ideas or opinions',
      'That your life has a sense of direction or meaning to it',
      'That you had warm and trusting relationships with others'
    ]
  }),
  matrixSection({
    id: 'q2', title: '2. Attention and Awareness', shortTitle: 'Attention & Awareness',
    prompt: 'For each item, rate how much it described your experience recently.', options: experienceScale,
    items: [
      'I was finding it difficult to stay focused on what was happening',
      'I was doing something without paying attention',
      'I was preoccupied with the future or the past',
      'I was doing something automatically, without being aware of what I was doing',
      'I was rushing through something without being really attentive to it'
    ]
  }),
  matrixSection({
    id: 'q3', title: '3. Understanding Emotions', shortTitle: 'Understanding Emotions',
    prompt: 'Rate the following statements as they apply to you.', options: agreementScale,
    items: [
      'It is important to me to try to understand what my feelings mean',
      'Thinking about my thoughts makes me more confused',
      'I often find it difficult to make sense of the way I feel about things'
    ]
  }),
  matrixSection({
    id: 'q4', title: '4. Mood and Depression Indicators', shortTitle: 'Mood',
    prompt: 'Over the last 2 weeks, how often have you been bothered by the following problem?',
    options: twoWeekFrequency,
    items: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, irritable or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself',
      'Trouble concentrating on things, such as work, reading or watching television',
      'Moving or speaking so slowly that other people could have noticed, or being so fidgety or restless that you have been moving around much more than usual'
    ]
  }),
  matrixSection({
    id: 'q5', title: '5. Anxiety Indicators', shortTitle: 'Anxiety',
    prompt: 'Over the last 2 weeks, how often have you been bothered by the following problem?',
    options: twoWeekFrequency,
    items: [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it is hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid, as if something awful might happen'
    ]
  }),
  matrixSection({
    id: 'q6', title: '6. Ministry Burnout', shortTitle: 'Ministry Burnout',
    prompt: 'Rate the following statements as they apply to you.', options: ministryFrequency,
    items: [
      'How often do you feel tired from ministry?',
      'How often do you feel emotionally exhausted from your ministry?',
      'Do you feel burned out because of your ministry?',
      'Do you feel worn out at the end of a ministry day?'
    ]
  }),
  {
    id: 'q7', title: '7. Distressing Events', shortTitle: 'Distressing Events', category: 'assessment',
    questions: [{
      id: 'q7', type: 'radio', required: true, options: yesNoOptions,
      text: 'There are distressing events, arising from ministry and/or personal life, that are significantly affecting my ability to sleep and to function effectively in daily life and ministry.'
    }]
  },
  checklistSection({
    id: 'q8', title: '8. Difficult Ministry Experiences', shortTitle: 'Difficult Experiences',
    prompt: 'Select any experiences that have applied to you in your ministry role during the last 12 months and are still causing you distress. Continue without selecting if none apply.',
    required: false,
    options: ['Sexual harassment', 'Threats of violence', 'Physical bullying', 'Unpleasant teasing', 'Conflicts and quarrels', 'Gossip and slander']
  }),
  checklistSection({
    id: 'q9', title: '9. Rest and Recovery', shortTitle: 'Rest & Recovery',
    prompt: 'Select as many statements as you agree with.',
    options: [
      'I have a wind-down period each day where I prepare myself for restful sleep',
      'I have already scheduled time off from ministry duties, including leave and retreats, to rest and recharge',
      'I engage in hobbies or relaxation activities as part of my daily routine',
      'I check in with family, friends, or my team to ensure they are also getting adequate rest',
      'I take regular breaks during the week, including a full day off from texts, emails, and work or ministry access',
      'None of these apply to me'
    ]
  }),
  checklistSection({
    id: 'q10', title: '10. Spiritual Wellbeing', shortTitle: 'Spiritual Wellbeing',
    prompt: 'Select as many statements as you agree with.',
    options: [
      'I am satisfied with how I am growing in my personal relationship with Jesus',
      'I do not compare my ministry with that of others as a way of measuring success',
      'I have regular time to nurture my spiritual life in Christ beyond ministry-related Bible reading',
      'In busy times, my personal spiritual devotions and practices do not reduce',
      'In busy times, my prayer life does not significantly reduce',
      'None of these apply to me'
    ]
  }),
  checklistSection({
    id: 'q11', title: '11. Support and Workload Management', shortTitle: 'Support & Workload',
    prompt: 'Select as many statements as you agree with.',
    options: [
      'I have someone with whom I regularly confess my fallings and failings',
      'I make time to regularly assess and adjust the sustainability of my work practices and commitments',
      'I recognise my own limitations and seek support when I need it',
      'I can easily prioritise and manage competing demands in ministry through effective time management and planning',
      'I have a way to seek helpful input for ministry issues that arise',
      'None of these apply to me'
    ]
  }),
  checklistSection({
    id: 'q12', title: '12. Emotional Awareness', shortTitle: 'Emotional Awareness',
    prompt: 'Select as many statements as you agree with.',
    options: [
      'I set aside daily time for personal reflection and growth, with a specific focus on developing emotional awareness and self-insight in my ministry',
      'I regularly engage in self-reflection to identify my emotional strengths and areas for growth',
      'I take time to reflect on my emotions and the emotional impact of my ministry',
      'I use reflective tools, such as mindfulness, meditation, or journaling, to increase awareness of my emotions and thought patterns in ministry',
      'I seek feedback from others to help me understand my emotional responses in ministry',
      'None of these apply to me'
    ]
  }),
  checklistSection({
    id: 'q13', title: '13. Relationships and Social Connection', shortTitle: 'Relationships',
    prompt: 'Select as many statements as you agree with.',
    options: [
      'I prioritise spending time with loved ones doing non-ministry activities and having non-ministry conversations',
      'I have someone in my life who asks me hard questions about my heart, purity, and relationship with Jesus',
      'I make intentional efforts to connect with members of my faith community on a personal level, beyond ministry duties',
      'I have regular time scheduled to connect with family and friends outside of ministry responsibilities',
      'I have people in my life to hang out with and have fun',
      'None of these apply to me'
    ]
  }),
  checklistSection({
    id: 'q14', title: '14. Physical Wellbeing', shortTitle: 'Physical Wellbeing',
    prompt: 'Select as many statements as you agree with.',
    options: [
      'I exercise at least three times a week',
      'I eat in a way that supports both my physical and mental health',
      'I get at least 8 hours of uninterrupted, restful sleep each night',
      'I keep up with necessary medical or health appointments and do not delay care',
      'I am able to maintain stable energy and focus throughout the week without relying on stimulants or sugar',
      'None of these apply to me'
    ]
  }),
  {
    id: 'research', title: 'Optional Research Questions', shortTitle: 'Research',
    category: 'research', includeInResults: false,
    questions: [
      {
        id: 'research_resign_current', type: 'radio', required: false, options: yesNoOptions,
        text: 'In the last 12 months, have you seriously considered resigning from your current ministry?'
      },
      {
        id: 'research_resign_ministry', type: 'radio', required: false, options: yesNoOptions,
        text: 'In the last 12 months, have you seriously considered resigning from ministry altogether?'
      },
      {
        id: 'research_leave_reasons', type: 'checkbox', required: false,
        text: 'Select any reasons why you would leave ministry.',
        options: [
          { label: 'I feel lonely and isolated', value: 'lonely' },
          { label: 'Immense stress of the job', value: 'stress' },
          { label: 'Impact on family', value: 'family' },
          { label: 'Church conflict', value: 'conflict' },
          { label: 'Leadership challenge with staff and teams', value: 'leadership' },
          { label: 'Other', value: 'other' }
        ]
      },
      {
        id: 'research_leave_other', type: 'text', required: true,
        text: 'If you selected “Other”, please elaborate.', placeholder: 'Please describe the other reason',
        showWhen: { questionId: 'research_leave_reasons', includes: 'other' }
      }
    ]
  }
];

export const questions = assessmentSections.flatMap((section) =>
  section.questions.map((question) => ({
    ...question,
    sectionId: section.id,
    sectionTitle: section.title,
    domain: section.shortTitle,
    category: section.category,
    includeInResults: section.includeInResults !== false
  }))
);

export const domains = assessmentSections
  .filter((section) => section.category === 'assessment')
  .map((section) => section.shortTitle);

export const initialHistory = [];

export function isQuestionVisible(question, answers) {
  if (!question.showWhen) return true;
  const controllingAnswer = answers[question.showWhen.questionId];
  if ('equals' in question.showWhen) return controllingAnswer === question.showWhen.equals;
  if ('includes' in question.showWhen) {
    return Array.isArray(controllingAnswer) && controllingAnswer.includes(question.showWhen.includes);
  }
  return true;
}

export function isAnswerComplete(question, answer) {
  if (question.required === false) return true;
  if (question.type === 'checkbox') return Array.isArray(answer) && answer.length > 0;
  if (question.type === 'email') {
    return typeof answer === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answer.trim());
  }
  if (question.type === 'text') {
    return typeof answer === 'string' && answer.trim().length > 0;
  }
  return answer !== undefined && answer !== null && answer !== '';
}

export function getAnswerLabel(question, answer) {
  if (answer === undefined || answer === null || answer === '') return 'Not answered';
  if (question.type === 'checkbox') {
    if (!Array.isArray(answer) || answer.length === 0) return 'None selected';
    return answer
      .map((value) => question.options.find((option) => option.value === value)?.label || value)
      .join('; ');
  }
  if (question.options) {
    return question.options.find((option) => option.value === answer)?.label || String(answer);
  }
  return String(answer);
}

// Compatibility helper: official company scoring was not available in the supplied form.
export function riskFor() {
  return {
    label: 'Completed', className: 'safe',
    message: 'Your responses have been recorded. Official scoring and interpretation require the company-approved scoring rules.'
  };
}
