import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const HERO_IMAGE = 'https://picsum.photos/id/1039/750/500';

const HomePage: React.FC = () => {
  const handleStart = () => {
    Taro.navigateTo({ url: '/pages/quiz/index' });
  };

  const handleImageError = () => {
    console.error('[Home] hero image load failed');
  };

  return (
    <View className={styles.container}>
      <View className={styles.brand}>
        <View className={styles.brandDot} />
        <Text className={styles.brandText}>人格旅行 · PERSONALITY TRIP</Text>
      </View>

      <View className={styles.hero}>
        <View className={styles.heroImageWrap}>
          <Image
            className={styles.heroImage}
            src={HERO_IMAGE}
            mode="aspectFill"
            onError={handleImageError}
          />
          <View className={styles.heroMask}>
            <Text className={styles.heroMaskText}>山川湖海，各有偏爱</Text>
          </View>
        </View>
        <Text className={styles.slogan}>让人格，遇见风景</Text>
        <Text className={styles.subSlogan}>
          {'7 道轻量选择题，为你匹配契合灵魂的\n人文底蕴与自然风景'}
        </Text>
      </View>

      <View className={styles.footer}>
        <Button className={styles.primaryButton} onClick={handleStart}>
          <Text className={styles.primaryButtonText}>开启我的人格旅行</Text>
        </Button>
        <Text className={styles.footerNote}>30 秒解锁专属旅行与人文风景</Text>
      </View>
    </View>
  );
};

export default HomePage;
