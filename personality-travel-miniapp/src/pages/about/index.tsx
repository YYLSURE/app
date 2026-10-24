import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const FEATURES = ['无广告，清爽使用', '无付费，核心功能全开放', '无强制登录，游客即开即测'];

const AboutPage: React.FC = () => {
  return (
    <View className={styles.container}>
      <View className={styles.brandCard}>
        <View className={styles.brandMark}>
          <Text className={styles.brandMarkText}>旅</Text>
        </View>
        <Text className={styles.brandName}>人格旅行</Text>
        <Text className={styles.brandVersion}>Version 1.0.0</Text>
      </View>

      <View className={styles.introCard}>
        <Text className={styles.introTitle}>产品介绍</Text>
        <Text className={styles.introText}>
          人格旅行是一款轻量化的趣味人格测试工具：通过 7 道简单选择题，判定你的专属旅行人格，并匹配契合气质的属地人文与自然风景，自动生成极简定制旅行攻略。
        </Text>
      </View>

      <View className={styles.featureList}>
        {FEATURES.map((item) => (
          <View key={item} className={styles.featureItem}>
            <View className={styles.featureDot} />
            <Text className={styles.featureText}>{item}</Text>
          </View>
        ))}
      </View>

      <View className={styles.footer}>
        <Text className={styles.footerText}>人格旅行 · 让每一次出发都契合灵魂</Text>
      </View>
    </View>
  );
};

export default AboutPage;
