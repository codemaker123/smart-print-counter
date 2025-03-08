<template>
  <div class="card-reader-container">
    <div class="card-reader">
      <!-- 指示文字 - 带有打字动画效果 -->
      <div class="instruction-text" :class="{ 'typing-animation': !isReading }">
        {{ statusText }}
      </div>
      
      <!-- 身份证占位区域 -->
      <div class="id-card-placeholder" 
           :class="{ 'reading': isReading, 'success': isSuccess, 'error': hasError }"
           @mouseenter="isHovering = true"
           @mouseleave="isHovering = false">
        <!-- 全息网格背景 -->
        <div class="holographic-grid"></div>
        
        <!-- 身份证模板 -->
        <div class="id-card-template" :class="{ 'tilt': isHovering }">
          <!-- 国徽图标 -->
          <div class="emblem-icon"></div>
          
          <!-- 身份证文字区域 -->
          <div class="id-card-text">
            <div class="id-card-title">中华人民共和国</div>
            <div class="id-card-subtitle">居民身份证</div>
            <div class="id-card-info-area">
              <div class="info-placeholder"></div>
              <div class="info-placeholder"></div>
              <div class="info-placeholder"></div>
            </div>
            <div class="id-card-number">
              <span v-for="(_, index) in 18" :key="index" class="number-placeholder"></span>
            </div>
          </div>
          
          <!-- 照片区域 -->
          <div class="photo-area"></div>
          
          <!-- 芯片图标 -->
          <div class="chip-icon"></div>
          
          <!-- 数据流动画 -->
          <div class="data-stream"></div>
        </div>
        
        <!-- 扫描线 -->
        <div class="scan-line" v-if="isReading"></div>
        <div class="scan-line-idle" v-else></div>
        
        <!-- 完成后的粒子效果 -->
        <div class="particles" v-if="isSuccess"></div>
      </div>
      
      <!-- 操作按钮 -->
      <button
        @click="startReading"
        :disabled="isReading"
        class="read-button"
      >
        <span class="button-text">{{ buttonText }}</span>
        <div class="button-glow"></div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isReading = ref(false)
const hasError = ref(false)
const isSuccess = ref(false)
const isHovering = ref(false)
const buttonText = ref('开始读取')
const statusText = ref('请将身份证放入读卡区域')

// 播放扫描音效
const playCardScanSound = () => {
  try {
    const audio = new Audio()
    audio.src = '/sounds/card-scan.mp3' // 需要添加相应的音效文件
    audio.volume = 0.5
    audio.play().catch(e => console.log('音频播放失败:', e))
  } catch (error) {
    console.error('播放音效失败:', error)
  }
}

const startReading = () => {
  isReading.value = true
  hasError.value = false
  isSuccess.value = false
  buttonText.value = '读取中...'
  statusText.value = '正在读取身份证信息，请稍候'
  
  // 播放扫描音效
  playCardScanSound()

  setTimeout(() => {
    isReading.value = false
    const isSuccessful = Math.random() > 0.3

    if (isSuccessful) {
      isSuccess.value = true
      statusText.value = '读取成功'
    } else {
      hasError.value = true
      statusText.value = '读取失败，请重试'
    }
    buttonText.value = '开始读取'
  }, 3000)
}

// 初始化粒子效果
onMounted(() => {
  // 这里可以添加更复杂的粒子初始化代码
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');

.card-reader-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  animation: fadeInUp 1s ease-out;
  position: relative;
  z-index: 10;
  perspective: 1200px;
  background: #F0F4FF; /* 雾蓝白背景 */
  overflow: hidden;
}

/* 添加极光柔光层 */
.card-reader-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 70%, rgba(148, 187, 233, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(172, 203, 238, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(200, 220, 255, 0.2) 0%, transparent 70%);
  animation: auroraGlow 15s ease-in-out infinite alternate;
  z-index: -1;
}

.card-reader {
  width: 960px;
  height: 720px;
  background: rgba(240, 244, 255, 0.25); /* 半透明背景 */
  border-radius: 29px;
  box-shadow: 
    0 0 36px rgba(120, 160, 255, 0.3),
    0 0 72px rgba(120, 160, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  backdrop-filter: blur(15px);
  overflow: hidden;
  border: 1.2px solid rgba(255, 255, 255, 0.5);
  /* 航空铝材质效果 */
  background-image: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.2) 100%);
}

/* 添加纳米级蜂窝导光纹 */
.card-reader::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    repeating-linear-gradient(60deg, rgba(255, 255, 255, 0.03) 0px, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 6px),
    repeating-linear-gradient(120deg, rgba(255, 255, 255, 0.03) 0px, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 6px),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0px, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 6px);
  background-size: 10px 18px;
  animation: honeycombGlow 8s linear infinite;
  z-index: -1;
}

/* 指示文字样式 - 深蓝发光字体 */
.instruction-text {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 34px;
  color: #0A2463; /* 深蓝色 */
  margin-bottom: 2.4rem;
  text-shadow: 
    0 0 6px rgba(120, 160, 255, 0.8),
    0 0 12px rgba(120, 160, 255, 0.5);
  letter-spacing: 1.2px;
  text-align: center;
  font-weight: 500;
}

/* 身份证占位区样式 */
.id-card-placeholder {
  width: 514px;
  height: 324px;
  border: 2.4px solid rgba(255, 255, 255, 0.7);
  border-radius: 14px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(240, 244, 255, 0.4), rgba(220, 230, 255, 0.3));
  box-shadow: 
    0 0 18px rgba(120, 160, 255, 0.3),
    0 0 36px rgba(120, 160, 255, 0.1);
  transition: all 0.5s ease;
  transform-style: preserve-3d;
  /* 添加航空铝材质效果 */
  background-image: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.3) 100%);
}

/* 全息网格背景 */
.holographic-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(90deg, rgba(120, 160, 255, 0.05) 1px, transparent 1px),
    linear-gradient(0deg, rgba(120, 160, 255, 0.05) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.5;
  animation: gridPulse 4s ease-in-out infinite;
}

/* 身份证模板 */
.id-card-template {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 95%;
  height: 95%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #ffffff, #f5f5f5);
  border-radius: 10px;
  box-shadow: 
    0 0 12px rgba(255, 255, 255, 0.2),
    0 0 24px rgba(120, 160, 255, 0.1);
  transition: transform 0.5s ease;
  overflow: hidden;
}

/* 国徽图标 - 全息投影效果 */
.emblem-icon {
  position: absolute;
  top: 24px;
  left: 24px;
  width: 72px;
  height: 72px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.8), rgba(212, 175, 55, 0.9));
  border-radius: 50%;
  opacity: 0.9;
  animation: hologramPulse 3s ease-in-out infinite;
  box-shadow: 
    0 0 15px rgba(255, 215, 0, 0.5),
    0 0 30px rgba(255, 215, 0, 0.3);
  overflow: hidden;
}

.emblem-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 1px, transparent 1px, transparent 5px),
    repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 1px, transparent 1px, transparent 5px);
  animation: hologramShift 4s linear infinite;
}

/* 身份证文字区域 - 深蓝发光字体 */
.id-card-text {
  position: absolute;
  top: 24px;
  left: 108px;
  right: 144px;
  height: calc(100% - 48px);
  display: flex;
  flex-direction: column;
}

.id-card-title {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 19px;
  font-weight: bold;
  color: #0A2463; /* 深蓝色 */
  margin-bottom: 6px;
  letter-spacing: 2px;
  text-shadow: 0 0 5px rgba(120, 160, 255, 0.5);
}

.id-card-subtitle {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 22px;
  font-weight: bold;
  color: #0A2463; /* 深蓝色 */
  margin-bottom: 24px;
  letter-spacing: 2px;
  text-shadow: 0 0 5px rgba(120, 160, 255, 0.5);
}

/* 悬浮能量环按钮 */
.read-button {
  margin-top: 3.6rem;
  padding: 1.2rem 3.6rem;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 29px;
  color: white;
  background: transparent; /* 透明背景 */
  border: 2px solid rgba(120, 160, 255, 0.7);
  border-radius: 60px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 
    0 0 12px rgba(120, 160, 255, 0.5),
    0 0 24px rgba(120, 160, 255, 0.3);
  transform: translateZ(24px);
  /* 呼吸微光效果 */
  animation: buttonBreath 3s infinite ease-in-out;
}

.read-button::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(90deg, 
    rgba(120, 160, 255, 0.7), 
    rgba(100, 200, 255, 0.7), 
    rgba(120, 160, 255, 0.7));
  border-radius: 60px;
  z-index: -1;
  animation: energyRingRotate 3s linear infinite;
}

/* 按钮读取时的光谱进度环 */
.read-button:disabled {
  opacity: 1;
  cursor: not-allowed;
  background: transparent;
  border-color: transparent;
}

.read-button:disabled::after {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 60px;
  background: conic-gradient(
    from 0deg,
    rgba(120, 160, 255, 0.9),
    rgba(100, 200, 255, 0.9),
    rgba(80, 180, 255, 0.9),
    rgba(60, 160, 255, 0.9),
    rgba(40, 140, 255, 0.9),
    rgba(120, 160, 255, 0.3)
  );
  animation: progressRing 3s linear infinite;
  z-index: -1;
}

/* 添加新的动画 */
@keyframes auroraGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

@keyframes honeycombGlow {
  0% { opacity: 0.3; background-position: 0 0; }
  50% { opacity: 0.5; }
  100% { opacity: 0.3; background-position: 10px 18px; }
}

@keyframes hologramPulse {
  0%, 100% { 
    opacity: 0.8; 
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.3);
  }
  50% { 
    opacity: 1; 
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.7), 0 0 50px rgba(255, 215, 0, 0.5);
  }
}

@keyframes hologramShift {
  0% { transform: translateX(-10px) translateY(-10px); }
  50% { transform: translateX(10px) translateY(10px); }
  100% { transform: translateX(-10px) translateY(-10px); }
}

@keyframes buttonBreath {
  0%, 100% { 
    box-shadow: 0 0 12px rgba(120, 160, 255, 0.5), 0 0 24px rgba(120, 160, 255, 0.3);
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
  }
  50% { 
    box-shadow: 0 0 20px rgba(120, 160, 255, 0.7), 0 0 40px rgba(120, 160, 255, 0.5);
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.9);
  }
}

@keyframes energyRingRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes progressRing {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 扫描线效果优化 */
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, 
    rgba(120, 160, 255, 0.1), 
    rgba(120, 160, 255, 0.8), 
    rgba(120, 160, 255, 0.1));
  box-shadow: 0 0 15px rgba(120, 160, 255, 0.8);
  animation: scan 2s ease-in-out infinite;
  z-index: 10;
}
.scan-line-idle {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(120, 160, 255, 0.1), 
    rgba(120, 160, 255, 0.5), 
    rgba(120, 160, 255, 0.1));
  transform: translateY(-50%);
  opacity: 0.5;
  animation: idlePulse 2s ease-in-out infinite;
}

/* 照片区域优化 */
.photo-area {
  position: absolute;
  top: 60px;
  right: 24px;
  width: 108px;
  height: 144px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 10px rgba(120, 160, 255, 0.2);
}

.photo-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0) 100%);
  animation: photoShimmer 3s ease-in-out infinite;
}

/* 添加人像轮廓 */
.photo-area::after {
  content: '';
  position: absolute;
  top: 30%;
  left: 50%;
  width: 60%;
  height: 40%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.15);
  border-radius: 50% 50% 0 0;
}

/* 芯片图标优化 */
.chip-icon {
  position: absolute;
  bottom: 24px;
  left: 24px;
  width: 48px;
  height: 36px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  animation: chipPulse 2s ease-in-out infinite;
  border: 1px solid rgba(150, 100, 0, 0.5);
}

.chip-icon::before, .chip-icon::after {
  content: '';
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
}

.chip-icon::before {
  top: 6px;
  left: 6px;
  right: 6px;
  height: 2px;
}

.chip-icon::after {
  top: 12px;
  left: 6px;
  right: 6px;
  height: 2px;
}

/* 数据流动画 */
.data-stream {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.reading .data-stream {
  opacity: 1;
}

.data-stream::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background-image: 
    radial-gradient(circle at center, rgba(120, 160, 255, 0.1) 0%, transparent 1%),
    radial-gradient(circle at center, rgba(120, 160, 255, 0.1) 0%, transparent 1%);
  background-size: 20px 20px;
  animation: dataFlow 3s linear infinite;
}

/* 粒子效果 */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
}

.particles::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(120, 160, 255, 0.8) 0%, transparent 0.5%),
    radial-gradient(circle at 40% 70%, rgba(120, 160, 255, 0.8) 0%, transparent 0.5%),
    radial-gradient(circle at 60% 20%, rgba(120, 160, 255, 0.8) 0%, transparent 0.5%),
    radial-gradient(circle at 80% 50%, rgba(120, 160, 255, 0.8) 0%, transparent 0.5%),
    radial-gradient(circle at 10% 60%, rgba(120, 160, 255, 0.8) 0%, transparent 0.5%),
    radial-gradient(circle at 30% 90%, rgba(120, 160, 255, 0.8) 0%, transparent 0.5%),
    radial-gradient(circle at 70% 80%, rgba(120, 160, 255, 0.8) 0%, transparent 0.5%),
    radial-gradient(circle at 90% 10%, rgba(120, 160, 255, 0.8) 0%, transparent 0.5%);
  animation: particleRise 2s ease-out;
}

/* 按钮发光效果 */
.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 60px;
  background: radial-gradient(circle at center, rgba(120, 160, 255, 0.8) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -2;
}

.read-button:hover .button-glow {
  opacity: 0.5;
}

/* 状态样式 */
.reading {
  border-color: rgba(120, 160, 255, 0.9);
  box-shadow: 
    0 0 25px rgba(120, 160, 255, 0.5),
    0 0 50px rgba(120, 160, 255, 0.3);
}

.success {
  border-color: rgba(100, 220, 120, 0.9);
  box-shadow: 
    0 0 25px rgba(100, 220, 120, 0.5),
    0 0 50px rgba(100, 220, 120, 0.3);
}

.error {
  border-color: rgba(255, 100, 100, 0.9);
  box-shadow: 
    0 0 25px rgba(255, 100, 100, 0.5),
    0 0 50px rgba(255, 100, 100, 0.3);
}

/* 补充缺失的动画 */
@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

@keyframes idlePulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}

@keyframes photoShimmer {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes chipPulse {
  0%, 100% { opacity: 0.8; box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
  50% { opacity: 1; box-shadow: 0 0 20px rgba(255, 215, 0, 0.7); }
}

@keyframes dataFlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes particleRise {
  0% { opacity: 1; transform: scale(0); }
  100% { opacity: 0; transform: scale(3); }
}

@keyframes gridPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: rgba(0, 162, 255, 0.8) }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes infoPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 0.9; }
}

@keyframes numberPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 0.9; }
}
</style>