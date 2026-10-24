import React, { useRef, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { QUESTIONS } from '@/data/questions';
import { calculatePersonality } from '@/utils/personality';
import type { PersonalityId } from '@/types/personality';
import styles from './index.module.scss';

const TOTAL = QUESTIONS.length;
/** 选中后自动跳转的过渡时长 */
const ADVANCE_DELAY = 300;

const QuizPage: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<PersonalityId[]>([]);
  /** 过渡动画期间锁定点击，避免连点造成跳题 */
  const lockingRef = useRef(false);

  const question = QUESTIONS[current];
  const selected = answers[current];
  const progress = Math.round(((current + 1) / TOTAL) * 100);

  const finishQuiz = (finalAnswers: PersonalityId[]) => {
    const id = calculatePersonality(finalAnswers);
    Taro.redirectTo({ url: `/pages/result/index?id=${id}&from=quiz` });
  };

  const handleSelect = (type: PersonalityId) => {
    if (lockingRef.current) return;
    lockingRef.current = true;

    const nextAnswers = [...answers];
    nextAnswers[current] = type;
    setAnswers(nextAnswers);
    console.info(`[Quiz] Q${current + 1} answered:`, type);

    setTimeout(() => {
      lockingRef.current = false;
      if (current < TOTAL - 1) {
        setCurrent(current + 1);
      } else {
        finishQuiz(nextAnswers);
      }
    }, ADVANCE_DELAY);
  };

  const handleBack = () => {
    if (current === 0) return;
    setCurrent(current - 1);
  };

  return (
    <View className={styles.container}>
      <View className={styles.topBar}>
        <View
          className={classnames(styles.backBtn, current === 0 && styles.backBtnDisabled)}
          onClick={handleBack}
        >
          <Text className={styles.backIcon}>‹</Text>
        </View>
        <Text className={styles.progressText}>
          {current + 1} / {TOTAL}
        </Text>
        <View className={styles.placeholder} />
      </View>

      <View className={styles.track}>
        <View className={styles.trackFill} style={{ width: `${progress}%` }} />
      </View>

      <View className={styles.questionBlock} key={question.id}>
        <Text className={styles.dimensionTag}>{question.dimension}</Text>
        <Text className={styles.questionTitle}>{question.title}</Text>

        <View className={styles.options}>
          {question.options.map((option) => {
            const isSelected = selected === option.type;
            return (
              <View
                key={option.key}
                className={classnames(styles.option, isSelected && styles.optionSelected)}
                onClick={() => handleSelect(option.type)}
              >
                <View
                  className={classnames(
                    styles.optionBadge,
                    isSelected && styles.optionBadgeSelected
                  )}
                >
                  <Text
                    className={classnames(
                      styles.badgeText,
                      isSelected && styles.badgeTextSelected
                    )}
                  >
                    {option.key}
                  </Text>
                </View>
                <Text className={styles.optionText}>{option.text}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View className={styles.footerHint}>
        <Text className={styles.footerHintText}>点击选项自动进入下一题 · 可返回修改</Text>
      </View>
    </View>
  );
};

export default QuizPage;
