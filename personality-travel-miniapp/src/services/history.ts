import Taro from '@tarojs/taro';
import type { HistoryRecord, PersonalityId } from '@/types/personality';

/** 历史档案本地缓存 Key */
const STORAGE_KEY = 'pt_history_records';

/** 读取全部历史测试记录（按时间倒序） */
export function getHistory(): HistoryRecord[] {
  try {
    const list = Taro.getStorageSync(STORAGE_KEY);
    if (!list || !Array.isArray(list)) {
      return [];
    }
    return (list as HistoryRecord[])
      .filter((item) => item && item.personalityId)
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    console.error('[History] getHistory failed:', err);
    return [];
  }
}

/** 新增一条测试记录 */
export function addHistory(personalityId: PersonalityId): HistoryRecord {
  const record: HistoryRecord = {
    id: `${Date.now()}`,
    personalityId,
    createdAt: Date.now()
  };
  try {
    const list = getHistory();
    list.unshift(record);
    Taro.setStorageSync(STORAGE_KEY, list);
    console.info('[History] record saved:', record.id);
  } catch (err) {
    console.error('[History] addHistory failed:', err);
  }
  return record;
}

/** 清空全部历史记录 */
export function clearHistory(): void {
  try {
    Taro.removeStorageSync(STORAGE_KEY);
    console.info('[History] all records cleared');
  } catch (err) {
    console.error('[History] clearHistory failed:', err);
  }
}
