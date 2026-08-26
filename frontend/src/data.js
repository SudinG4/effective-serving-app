export const domains = ['Emotional Health','Stress & Anxiety','Sleep & Energy','Social Connection','Daily Functioning'];

const prompts = [
  ['Emotional Health','felt down, low, or without hope?'],
  ['Stress & Anxiety','felt nervous, anxious, or on edge?'],
  ['Sleep & Energy','had trouble sleeping or felt low in energy?'],
  ['Social Connection','felt lonely or isolated from other people?'],
  ['Daily Functioning','found it difficult to complete everyday responsibilities?']
];

export const questions = prompts.map(([domain, text], index) => ({
  id: index + 1, domain, text: `Over the past two weeks, how often have you ${text}`
}));

export const options = [
  {label:'Not at all',value:0},{label:'Rarely',value:1},{label:'Sometimes',value:2},
  {label:'Often',value:3},{label:'Nearly every day',value:4}
];

export const initialHistory = [
  {date:'18 Aug 2026',score:15,label:'At Risk'},
  {date:'02 May 2026',score:10,label:'Borderline'},
  {date:'11 Feb 2026',score:5,label:'No Risk'}
];

export function riskFor(score){
  if(score <= 6) return {label:'No Risk',className:'safe',message:'Your answers currently indicate a lower level of concern. Keep checking in with yourself and continue the habits that support you.'};
  if(score <= 13) return {label:'Borderline',className:'watch',message:'Some areas may benefit from extra attention. Consider talking with someone you trust or a qualified health professional.'};
  return {label:'At Risk',className:'risk',message:'Your answers indicate that additional support may be helpful. Please consider contacting a qualified health professional soon.'};
}
