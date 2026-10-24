import React, { useState } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { PERSONALITIES } from '@/data/personalities';
import { getHistory, clearHistory } from '@/services/history';
import type { HistoryRecord, Personality } from '@/types/personality';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const [records, setRecords] = useState<HistoryRecord[]>([]);

  // 每次展示页面时刷新档案列表（测试后返回可即时看到新记录）
  Taro.useDidShow(() => {
    setRecords(getHistory());
  });

  const handleOpenRecord = (record: HistoryRecord) => {
    Taro.navigateTo({ url: `/pages/result/index?id=${record.personalityId}` });
  };

  const handleStart = () => {
    Taro.navigateTo({ url: '/pages/quiz/index' });
  };

  const handleAbout = () => {
    Taro.navigateTo({ url: '/pages/about/index' });
  };

  const handleClear = async () => {
    if (records.length === 0) return;
    try {
      const res = await Taro.showModal({
        title: '清空历史记录',
        content: '确定清空全部旅行档案吗？此操作不可恢复',
        confirmText: '清空',
        confirmColor: '#c97f74'
      });
      if (res.confirm) {
        clearHistory();
        setRecords([]);
        Taro.showToast({ title: '已清空', icon: 'success' });
      }
    } catch (err) {
      console.error('[Mine] clear history failed:', err);
    }
  };

  const handleImageError = (id: string) => () => {
    console.error(`[Mine] record ${id} image load failed`);
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>我的旅行档案</Text>
        <Text className={styles.headerSub}>
          {records.length > 0 ? `已收藏 ${records.length} 份人格旅行报告` : '测一次，收藏一座与你契合的城'}
        </Text>
      </View>

      {records.length === 0 ? (
        <View className={styles.empty}>
          <View className={styles.emptyCircle}>
            <Text className={styles.emptyIcon} style={{ color: '#6f9288' }}>
              旅
            </Text>
          </View>
          <Text className={styles.emptyTitle}>还没有旅行档案</Text>
          <Text className={styles.emptyDesc}>30 秒测试，解锁你的专属旅行人格</Text>
          <Button className={styles.emptyButton} onClick={handleStart}>
            <Text className={styles.emptyButtonText}>开启第一次测试</Text>
          </Button>
        </View>
      ) : (
        <View className={styles.recordList}>
          {records.map((record) => {
            const personality: Personality | undefined = PERSONALITIES[record.personalityId];
            if (!personality) return null;
            return (
              <View
                key={record.id}
                className={styles.recordCard}
                onClick={() => handleOpenRecord(record)}
              >
                <Image
                  className={styles.recordThumb}
                  src={personality.hero.replace('750/500', '200/200')}
                  mode="aspectFill"
                  onError={handleImageError(record.id)}
                />
                <View className={styles.recordBody}>
                  <Text className={styles.recordName}>
                    {personality.name} · {personality.destination}
                  </Text>
                  <Text className={styles.recordMeta}>{personality.tags.join(' / ')}</Text>
                  <Text className={styles.recordDate}>
                    {dayjs(record.createdAt).format('YYYY.MM.DD HH:mm')}
                  </Text>
                </View>
                <Text className={styles.recordArrow}>›</Text>
              </View>
            );
          })}
        </View>
      )}

      <View className={styles.footerActions}>
        <View className={classnames(styles.menuCard)} onClick={handleAbout}>
          <Text className={styles.menuLabel}>关于我们</Text>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        {records.length > 0 && (
          <Button className={styles.clearButton} onClick={handleClear}>
            <Text className={styles.clearButtonText}>清空历史记录</Text>
          </Button>
        )}
      </View>
    </View>
  );
};

export default MinePage;
