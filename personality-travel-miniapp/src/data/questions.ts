import type { QuizQuestion } from '@/types/personality';

/**
 * 固定 7 题趣味测试题库
 * 维度覆盖：出行偏好 / 审美喜好 / 性格特质 / 休闲习惯 / 旅行方式 / 夜晚偏好 / 理想画面
 * 每个选项对应一个人格标签权重，答完加权计分
 */
export const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    dimension: '出行偏好',
    title: '终于盼来假期，你最理想的旅行节奏是？',
    options: [
      { key: 'A', text: '找一处湖畔山居，听雨发呆，让时间慢下来', type: 'healing' },
      { key: 'B', text: '钻进还没被人群占领的村寨与小巷', type: 'niche' },
      { key: 'C', text: '登顶俯瞰，把壮阔山河尽收眼底', type: 'wild' },
      { key: 'D', text: '睡到自然醒，在茶馆里消磨半日时光', type: 'chill' }
    ]
  },
  {
    id: 2,
    dimension: '审美喜好',
    title: '下面哪一种画面，最容易让你心动？',
    options: [
      { key: 'A', text: '烟雨朦胧、如水墨画一般的朦胧景致', type: 'healing' },
      { key: 'B', text: '粗粝真实、未经修饰的原生生活质感', type: 'niche' },
      { key: 'C', text: '刀劈斧削、直冲天际的奇峰绝壁', type: 'wild' },
      { key: 'D', text: '朱墙黛瓦、飞檐斗拱的肃穆古建筑', type: 'culture' }
    ]
  },
  {
    id: 3,
    dimension: '性格特质',
    title: '朋友通常会用哪个词来形容你？',
    options: [
      { key: 'A', text: '温和细腻，是大家身边的「治愈系」', type: 'healing' },
      { key: 'B', text: '好奇独立，总走和别人不一样的路', type: 'niche' },
      { key: 'C', text: '敢闯敢拼，天生的肾上腺素爱好者', type: 'wild' },
      { key: 'D', text: '从容随和，天塌下来也不慌不忙', type: 'chill' }
    ]
  },
  {
    id: 4,
    dimension: '休闲习惯',
    title: '不用出门的休息日，你最常做什么？',
    options: [
      { key: 'A', text: '读书、煮茶、侍弄花花草草', type: 'healing' },
      { key: 'B', text: '翻地图刷攻略，标记下一个冷门目的地', type: 'niche' },
      { key: 'C', text: '徒步、露营、安排一场户外运动', type: 'wild' },
      { key: 'D', text: '逛吃逛吃，用味蕾认识一座城', type: 'chill' }
    ]
  },
  {
    id: 5,
    dimension: '旅行方式',
    title: '出发去一座城，你最期待的体验是？',
    options: [
      { key: 'A', text: '住进有故事的民宿，和老板彻夜聊天', type: 'romantic' },
      { key: 'B', text: '不做攻略，迷路本身也是一种风景', type: 'niche' },
      { key: 'C', text: '把当地极限体验清单全部拉满', type: 'wild' },
      { key: 'D', text: '请讲解蹭导游，把古迹看出门道', type: 'culture' }
    ]
  },
  {
    id: 6,
    dimension: '夜晚偏好',
    title: '旅途中的夜晚，你更想要怎样度过？',
    options: [
      { key: 'A', text: '海边或古城的小酒馆，听一场驻唱', type: 'romantic' },
      { key: 'B', text: '围坐篝火，听当地人讲祖辈的故事', type: 'culture' },
      { key: 'C', text: '夜市从头吃到尾，越热闹越有烟火气', type: 'chill' },
      { key: 'D', text: '在星空下露营，等一场壮丽日出', type: 'wild' }
    ]
  },
  {
    id: 7,
    dimension: '理想画面',
    title: '如果只能定格一个旅行瞬间，你希望是？',
    options: [
      { key: 'A', text: '苍山洱海之间，风吹过发梢与自由', type: 'romantic' },
      { key: 'B', text: '古城墙上骑行看夕阳，恍若梦回长安', type: 'culture' },
      { key: 'C', text: '西湖烟雨中乘一叶小舟轻轻荡漾', type: 'healing' },
      { key: 'D', text: '老街竹椅上，端着一碗盖碗茶发呆', type: 'chill' }
    ]
  }
];
