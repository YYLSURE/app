import type { PersonalityId } from '@/types/personality';
import { PERSONALITY_ORDER } from '@/data/personalities';

/**
 * 根据 7 道题的选择加权计算旅行人格
 * 规则：每个选项命中一个人格标签计 1 分，取得分最高者；
 * 同分平局时按 PERSONALITY_ORDER 顺序兜底，保证结果唯一且稳定。
 */
export function calculatePersonality(answers: PersonalityId[]): PersonalityId {
  const score = {} as Record<PersonalityId, number>;
  PERSONALITY_ORDER.forEach((id) => {
    score[id] = 0;
  });

  answers.forEach((type) => {
    if (type) {
      score[type] += 1;
    }
  });

  const winner = PERSONALITY_ORDER.reduce((best, id) => {
    return score[id] > score[best] ? id : best;
  }, PERSONALITY_ORDER[0]);

  console.info('[Quiz] personality score:', score, 'winner:', winner);
  return winner;
}
