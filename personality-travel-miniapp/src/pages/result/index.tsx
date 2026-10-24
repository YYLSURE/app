import React, { useState } from 'react';
import { View, Text, Image, Button, Canvas } from '@tarojs/components';
import Taro from '@tarojs/taro';
import dayjs from 'dayjs';
import { PERSONALITIES } from '@/data/personalities';
import { addHistory } from '@/services/history';
import type { Personality, PersonalityId } from '@/types/personality';
import styles from './index.module.scss';

// 海报画布逻辑尺寸（px）
const POSTER_WIDTH = 640;
const POSTER_HEIGHT = 1180;

type DrawCtx = ReturnType<typeof Taro.createCanvasContext>;

/** 按字符宽度逐字换行绘制，返回绘制结束后的 y 坐标 */
function drawWrappedText(
  ctx: DrawCtx,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
): number {
  let line = '';
  let currentY = y;
  let lineCount = 0;

  for (let i = 0; i < text.length; i++) {
    const testLine = line + text[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lineCount += 1;
      if (lineCount === maxLines) {
        ctx.fillText(`${line.slice(0, -1)}…`, x, currentY);
        return currentY + lineHeight;
      }
      ctx.fillText(line, x, currentY);
      line = text[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

/** 绘制极简排版海报（纯文字+色块，保证多端稳定生成） */
function drawPoster(ctx: DrawCtx, p: Personality): void {
  ctx.setFillStyle('#f6f5f1');
  ctx.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT);

  // 顶部人格色带
  ctx.setFillStyle(p.accent);
  ctx.fillRect(0, 0, POSTER_WIDTH, 280);

  ctx.setFillStyle('rgba(255,255,255,0.82)');
  ctx.setFontSize(20);
  ctx.fillText('人格旅行 · 专属报告', 48, 72);

  ctx.setFillStyle('#ffffff');
  ctx.setFontSize(46);
  ctx.fillText(p.name, 48, 152);

  ctx.setFillStyle('rgba(255,255,255,0.92)');
  ctx.setFontSize(24);
  ctx.fillText(`适配属地 · ${p.destination}（${p.region}）`, 48, 204);

  ctx.setFillStyle('rgba(255,255,255,0.75)');
  ctx.setFontSize(20);
  ctx.fillText(p.tags.join('    '), 48, 246);

  let y = 336;
  ctx.setFillStyle('#9aa09b');
  ctx.setFontSize(20);
  ctx.fillText('人格特质', 48, y);
  y += 44;
  ctx.setFillStyle('#3f4441');
  ctx.setFontSize(26);
  y = drawWrappedText(ctx, p.summary, 48, y, POSTER_WIDTH - 96, 40, 4) + 28;

  ctx.setFillStyle('#9aa09b');
  ctx.setFontSize(20);
  ctx.fillText('必打卡景点', 48, y);
  y += 44;
  ctx.setFillStyle('#55726a');
  ctx.setFontSize(26);
  p.spots.forEach((spot, index) => {
    ctx.fillText(`${index + 1}. ${spot.name}`, 48, y);
    y += 46;
  });
  y += 8;

  ctx.setFillStyle('#9aa09b');
  ctx.setFontSize(20);
  ctx.fillText('特色美食', 48, y);
  y += 44;
  ctx.setFillStyle('#3f4441');
  ctx.setFontSize(24);
  y = drawWrappedText(ctx, p.foods.join('、'), 48, y, POSTER_WIDTH - 96, 36, 2) + 24;

  ctx.setFillStyle('#9aa09b');
  ctx.setFontSize(20);
  ctx.fillText('出行建议', 48, y);
  y += 44;
  ctx.setFillStyle('#6c726d');
  ctx.setFontSize(24);
  drawWrappedText(ctx, p.tips, 48, y, POSTER_WIDTH - 96, 36, 3);

  // 底部品牌区
  ctx.setStrokeStyle('#e7e5de');
  ctx.beginPath();
  ctx.moveTo(48, 1096);
  ctx.lineTo(POSTER_WIDTH - 48, 1096);
  ctx.stroke();

  ctx.setFillStyle('#6c726d');
  ctx.setFontSize(20);
  ctx.fillText('人格旅行 · 让人格，遇见风景', 48, 1140);
  ctx.setFillStyle('#9aa09b');
  ctx.setFontSize(18);
  ctx.setTextAlign('right');
  ctx.fillText(dayjs().format('YYYY.MM.DD'), POSTER_WIDTH - 48, 1140);
  // 重新设置左对齐避免影响后续绘制
  ctx.setTextAlign('left');
}

/** 微信端：保存图片到相册（含授权处理） */
async function saveToAlbum(filePath: string): Promise<void> {
  const setting = await Taro.getSetting();
  if (!setting.authSetting['scope.writePhotosAlbum']) {
    try {
      await Taro.authorize({ scope: 'scope.writePhotosAlbum' });
    } catch (err) {
      console.error('[Poster] authorize writePhotosAlbum failed:', err);
      const modal = await Taro.showModal({
        title: '需要相册权限',
        content: '请在设置中允许保存图片到相册',
        confirmText: '去设置'
      });
      if (modal.confirm) {
        await Taro.openSetting();
      }
      throw new Error('相册授权未完成');
    }
  }
  await Taro.saveImageToPhotosAlbum({ filePath });
}

const ResultPage: React.FC = () => {
  const [personality, setPersonality] = useState<Personality | null>(null);

  Taro.useLoad((options) => {
    const id = options?.id as PersonalityId;
    const target = PERSONALITIES[id];
    if (!target) {
      console.error('[Result] invalid personality id:', options?.id);
      Taro.showToast({ title: '报告不存在，请重新测试', icon: 'none' });
      setTimeout(() => Taro.navigateBack(), 900);
      return;
    }
    setPersonality(target);
    if (options?.from === 'quiz') {
      addHistory(target.id);
    }
  });

  Taro.useShareAppMessage(() => ({
    title: personality
      ? `我的旅行人格是${personality.name}，在${personality.destination}找到了归属，来测测你？`
      : '人格旅行 · 让人格，遇见风景',
    path: '/pages/index/index'
  }));

  const handleSavePoster = async () => {
    if (!personality) return;
    Taro.showLoading({ title: '海报生成中', mask: true });
    const ctx = Taro.createCanvasContext('posterCanvas');
    drawPoster(ctx, personality);

    ctx.draw(false, async () => {
      try {
        if (process.env.TARO_ENV === 'weapp') {
          const res = await Taro.canvasToTempFilePath({
            canvasId: 'posterCanvas',
            width: POSTER_WIDTH,
            height: POSTER_HEIGHT,
            destWidth: POSTER_WIDTH * 2,
            destHeight: POSTER_HEIGHT * 2,
            fileType: 'png'
          });
          await saveToAlbum(res.tempFilePath);
          Taro.hideLoading();
          Taro.showToast({ title: '海报已保存', icon: 'success' });
        } else {
          // H5 预览：直接导出 canvas 并触发下载
          const canvasNode = document.getElementById('posterCanvasDom') as HTMLCanvasElement | null;
          if (canvasNode) {
            const dataUrl = canvasNode.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `人格旅行-${personality.name}.png`;
            link.click();
            Taro.hideLoading();
            Taro.showToast({ title: '海报已生成', icon: 'success' });
          } else {
            throw new Error('canvas node not found');
          }
        }
      } catch (err) {
        console.error('[Poster] generate failed:', err);
        Taro.hideLoading();
        Taro.showToast({ title: '海报生成失败，请截图保存', icon: 'none' });
      }
    });
  };

  const handleShare = () => {
    if (process.env.TARO_ENV !== 'weapp') {
      Taro.showModal({
        title: '分享给好友',
        content: '在微信小程序中点击此按钮，即可一键转发给微信好友或群聊',
        showCancel: false,
        confirmText: '知道了'
      });
    }
  };

  const handleRetake = () => {
    Taro.redirectTo({ url: '/pages/quiz/index' });
  };

  const handleImageError = (scope: string) => () => {
    console.error(`[Result] ${scope} image load failed`);
  };

  if (!personality) {
    return <View className={styles.container} />;
  }

  return (
    <View className={styles.container}>
      <View className={styles.hero}>
        <Image
          className={styles.heroImage}
          src={personality.hero}
          mode="aspectFill"
          onError={handleImageError('hero')}
        />
        <View className={styles.heroMask}>
          <Text className={styles.heroRegion}>{personality.region}</Text>
          <Text className={styles.heroName}>
            {personality.destination} · {personality.name}
          </Text>
          <View className={styles.tagRow}>
            {personality.tags.map((tag) => (
              <Text key={tag} className={styles.heroTag}>
                {tag}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {/* 模块1：专属旅行人格卡片 */}
      <View className={styles.card}>
        <View className={styles.cardTitleRow}>
          <View className={styles.titleBar} />
          <Text className={styles.cardTitle}>专属旅行人格</Text>
        </View>
        <Text className={styles.summaryText}>{personality.summary}</Text>
      </View>

      {/* 模块2：属地匹配原因 */}
      <View className={styles.card}>
        <View className={styles.cardTitleRow}>
          <View className={styles.titleBar} />
          <Text className={styles.cardTitle}>为什么是{personality.destination}</Text>
          <Text className={styles.cardSubTitle}>人文与风景的契合</Text>
        </View>
        <View className={styles.matchItem}>
          <View
            className={styles.matchBadge}
            style={{ background: personality.accentLight }}
          >
            <Text className={styles.matchBadgeText} style={{ color: personality.accent }}>
              文
            </Text>
          </View>
          <View className={styles.matchBody}>
            <Text className={styles.matchLabel}>人文底蕴</Text>
            <Text className={styles.matchText}>{personality.culture}</Text>
          </View>
        </View>
        <View className={styles.matchItem}>
          <View
            className={styles.matchBadge}
            style={{ background: personality.accentLight }}
          >
            <Text className={styles.matchBadgeText} style={{ color: personality.accent }}>
              景
            </Text>
          </View>
          <View className={styles.matchBody}>
            <Text className={styles.matchLabel}>自然风景</Text>
            <Text className={styles.matchText}>{personality.scenery}</Text>
          </View>
        </View>
      </View>

      {/* 模块3：专属定制旅行攻略 */}
      <View className={styles.card}>
        <View className={styles.cardTitleRow}>
          <View className={styles.titleBar} />
          <Text className={styles.cardTitle}>专属旅行攻略</Text>
        </View>

        {personality.spots.map((spot) => (
          <View key={spot.name} className={styles.spotItem}>
            <Image
              className={styles.spotImage}
              src={spot.image}
              mode="aspectFill"
              onError={handleImageError(`spot-${spot.name}`)}
            />
            <View className={styles.spotBody}>
              <Text className={styles.spotName}>{spot.name}</Text>
              <Text className={styles.spotDesc}>{spot.desc}</Text>
            </View>
          </View>
        ))}

        <View className={styles.guideGroup}>
          <Text className={styles.guideLabel}>特色人文体验</Text>
          <View className={styles.pillRow}>
            {personality.experiences.map((item) => (
              <Text
                key={item}
                className={styles.pill}
                style={{ background: personality.accentLight, color: personality.accent }}
              >
                {item}
              </Text>
            ))}
          </View>
        </View>

        <View className={styles.guideGroup}>
          <Text className={styles.guideLabel}>本地特色美食</Text>
          <View className={styles.pillRow}>
            {personality.foods.map((item) => (
              <Text key={item} className={styles.pill} style={{ background: '#f2f0ea', color: '#8a7f6b' }}>
                {item}
              </Text>
            ))}
          </View>
        </View>

        <View className={styles.tipsBox} style={{ background: personality.accentLight }}>
          <Text className={styles.tipsText}>出行建议　{personality.tips}</Text>
        </View>
      </View>

      {/* 模块4：功能操作区 */}
      <View className={styles.actionBar}>
        <View className={styles.actionRow}>
          <Button
            className={styles.shareButton}
            openType="share"
            onClick={handleShare}
          >
            <Text className={styles.shareButtonText}>分享好友</Text>
          </Button>
          <Button className={styles.saveButton} onClick={handleSavePoster}>
            <Text className={styles.saveButtonText}>保存海报</Text>
          </Button>
        </View>
        <Button className={styles.retakeButton} onClick={handleRetake}>
          <Text className={styles.retakeButtonText}>重新测试</Text>
        </Button>
      </View>

      <Canvas
        canvasId="posterCanvas"
        id="posterCanvasDom"
        className={styles.posterCanvas}
        style={{ width: `${POSTER_WIDTH}px`, height: `${POSTER_HEIGHT}px` }}
      />
    </View>
  );
};

export default ResultPage;
