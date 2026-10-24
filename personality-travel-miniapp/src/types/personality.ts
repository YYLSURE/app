// 旅行人格相关类型定义

/** 六种旅行人格 ID */
export type PersonalityId =
  | 'healing' // 治愈人文型
  | 'niche' // 小众探索型
  | 'wild' // 热血山河型
  | 'chill' // 慢享休闲型
  | 'culture' // 人文古韵型
  | 'romantic'; // 浪漫文艺型

/** 单题选项 */
export interface QuizOption {
  /** 选项序号 A-D */
  key: string;
  /** 选项文案 */
  text: string;
  /** 该选项加权命中的人格 */
  type: PersonalityId;
}

/** 测试题目 */
export interface QuizQuestion {
  /** 题目序号，从 1 开始 */
  id: number;
  /** 题目维度，如：出行偏好 */
  dimension: string;
  /** 题干 */
  title: string;
  /** 四个选项 */
  options: QuizOption[];
}

/** 必打卡景点 */
export interface Spot {
  name: string;
  desc: string;
  image: string;
}

/** 人格 + 属地匹配完整结果 */
export interface Personality {
  id: PersonalityId;
  /** 人格名称，如：治愈人文型 */
  name: string;
  /** 匹配目的地 */
  destination: string;
  /** 属地所属区域 */
  region: string;
  /** 人格标签 */
  tags: string[];
  /** 人格特质解读 */
  summary: string;
  /** 人文层面匹配原因 */
  culture: string;
  /** 风景层面匹配原因 */
  scenery: string;
  /** 必打卡核心景点（2-3 个） */
  spots: Spot[];
  /** 特色人文体验 */
  experiences: string[];
  /** 本地特色美食 */
  foods: string[];
  /** 简易出行建议 */
  tips: string;
  /** 人格强调色（莫兰迪） */
  accent: string;
  /** 人格浅底色 */
  accentLight: string;
  /** 报告头图 */
  hero: string;
}

/** 历史测试记录（本地缓存） */
export interface HistoryRecord {
  /** 记录唯一 ID（时间戳） */
  id: string;
  /** 命中的人格 ID */
  personalityId: PersonalityId;
  /** 测试完成时间戳 */
  createdAt: number;
}
