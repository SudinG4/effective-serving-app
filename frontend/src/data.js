export const domains = ['Emotional Health','Stress & Anxiety','Sleep & Energy','Social Connection','Daily Functioning'];

const prompts = [
  ['Emotional Health','felt down, low, or without hope?'],
  ['Emotional Health','had little interest or pleasure in doing things?'],
  ['Emotional Health','found it hard to feel positive about the future?'],
  ['Emotional Health','felt emotionally overwhelmed?'],
  ['Emotional Health','been unusually irritable or frustrated?'],
  ['Emotional Health','felt able to manage difficult emotions?'],
  ['Stress & Anxiety','felt nervous, anxious, or on edge?'],
  ['Stress & Anxiety','been unable to stop or control worrying?'],
  ['Stress & Anxiety','worried too much about different things?'],
  ['Stress & Anxiety','found it difficult to relax?'],
  ['Stress & Anxiety','felt restless or unable to sit still?'],
  ['Stress & Anxiety','felt afraid something awful might happen?'],
  ['Sleep & Energy','had trouble falling or staying asleep?'],
  ['Sleep & Energy','woken without feeling refreshed?'],
  ['Sleep & Energy','felt tired or had very little energy?'],
  ['Sleep & Energy','found your sleep schedule difficult to maintain?'],
  ['Sleep & Energy','struggled to concentrate because of tiredness?'],
  ['Social Connection','felt lonely or isolated from others?'],
  ['Social Connection','felt that you had someone to talk to?'],
  ['Social Connection','avoided friends, family, or social situations?'],
  ['Social Connection','felt supported by people around you?'],
  ['Social Connection','found it hard to connect meaningfully with others?'],
  ['Daily Functioning','found it difficult to complete everyday responsibilities?'],
  ['Daily Functioning','struggled to concentrate on work or study?'],
  ['Daily Functioning','found it difficult to make everyday decisions?'],
  ['Daily Functioning','felt unable to keep up with your usual routine?'],
  ['Daily Functioning','felt that your wellbeing affected work, study, or relationships?']
];

export const questions = prompts.map(([domain, text], index) => ({
  id: index + 1, domain, text: `Over the past two weeks, how often have you ${text}`
}));

export const options = [
  {label:'Not at all',value:0},{label:'Rarely',value:1},{label:'Sometimes',value:2},
  {label:'Often',value:3},{label:'Nearly every day',value:4}
];

export const initialHistory = [
  {date:'18 Aug 2026',score:74,label:'At Risk'},
  {date:'02 May 2026',score:58,label:'Borderline'},
  {date:'11 Feb 2026',score:29,label:'No Risk'}
];

export function riskFor(score){
  if(score <= 35) return {label:'No Risk',className:'safe',message:'Your answers currently indicate a lower level of concern. Keep checking in with yourself and continue the habits that support you.'};
  if(score <= 70) return {label:'Borderline',className:'watch',message:'Some areas may benefit from extra attention. Consider talking with someone you trust or a qualified health professional.'};
  return {label:'At Risk',className:'risk',message:'Your answers indicate that additional support may be helpful. Please consider contacting a qualified health professional soon.'};
}
