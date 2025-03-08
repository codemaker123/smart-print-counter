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
  perspective: 1200px; /* 从1000px放大到1200px */
}

.card-reader {
  width: 960px; /* 从800px放大到960px */
  height: 720px; /* 从600px放大到720px */
  background: rgba(10, 15, 30, 0.7);
  border-radius: 29px; /* 从24px放大到29px */
  box-shadow: 
    0 0 36px rgba(0, 162, 255, 0.3),
    0 0 72px rgba(0, 162, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  backdrop-filter: blur(10px);
  overflow: hidden;
  border: 1.2px solid rgba(0, 162, 255, 0.3); /* 从1px放大到1.2px */
}

/* 指示文字样式 */
.instruction-text {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 34px; /* 从28px放大到34px */
  color: #fff;
  margin-bottom: 2.4rem; /* 从2rem放大到2.4rem */
  text-shadow: 
    0 0 6px rgba(0, 162, 255, 0.8),
    0 0 12px rgba(0, 162, 255, 0.5);
  letter-spacing: 1.2px; /* 从1px放大到1.2px */
  text-align: center;
}

/* 身份证占位区样式 */
.id-card-placeholder {
  width: 514px; /* 从428px放大到514px */
  height: 324px; /* 从270px放大到324px */
  border: 2.4px solid rgba(0, 162, 255, 0.5); /* 从2px放大到2.4px */
  border-radius: 14px; /* 从12px放大到14px */
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(0, 20, 50, 0.8), rgba(0, 10, 30, 0.9));
  box-shadow: 
    0 0 18px rgba(0, 162, 255, 0.3),
    0 0 36px rgba(0, 162, 255, 0.1);
  transition: all 0.5s ease;
  transform-style: preserve-3d;
}

/* 全息网格背景 */
.holographic-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(90deg, rgba(0, 162, 255, 0.1) 1px, transparent 1px),
    linear-gradient(0deg, rgba(0, 162, 255, 0.1) 1px, transparent 1px);
  background-size: 24px 24px; /* 从20px放大到24px */
  opacity: 0.3;
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
  background: linear-gradient(135deg, #f8f8f8, #e8e8e8); /* 更真实的底色 */
  border-radius: 10px;
  box-shadow: 
    0 0 12px rgba(255, 255, 255, 0.1),
    0 0 24px rgba(0, 162, 255, 0.1);
  transition: transform 0.5s ease;
  overflow: hidden;
}

/* 国徽图标 */
.emblem-icon {
  position: absolute;
  top: 24px;
  left: 24px;
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #d4af37, #f2d279);
  border-radius: 50%;
  opacity: 0.9;
  animation: emblemPulse 3s ease-in-out infinite;
  /* 添加国徽内部结构 */
  box-shadow: inset 0 0 0 2px rgba(180, 130, 0, 0.5);
  overflow: hidden;
}

.emblem-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60%;
  height: 60%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, #f2d279 0%, transparent 70%);
  border-radius: 50%;
}

.emblem-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40%;
  height: 40%;
  transform: translate(-50%, -50%);
  background: #d4af37;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
}

/* 身份证文字区域 */
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
  color: #000;
  margin-bottom: 6px;
  letter-spacing: 2px; /* 增加字间距 */
}

.id-card-subtitle {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 22px;
  font-weight: bold;
  color: #000;
  margin-bottom: 24px;
  letter-spacing: 2px; /* 增加字间距 */
}

/* 身份证信息区域优化 */
.id-card-info-area {
  display: flex;
  flex-direction: column;
  gap: 18px; /* 增加间距 */
  margin-bottom: 24px;
}

.info-placeholder {
  height: 14px;
  width: 90%; /* 增加宽度 */
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  animation: infoPulse 2s ease-in-out infinite;
  position: relative;
  display: flex;
  align-items: center;
}

/* 添加信息标签 */
.info-placeholder::before {
  content: '';
  position: absolute;
  left: -24px;
  width: 18px;
  height: 14px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}

/* 身份证号码区域优化 */
.id-card-number {
  display: flex;
  flex-wrap: wrap;
  gap: 6px; /* 增加间距 */
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1); /* 添加分隔线 */
}

.number-placeholder {
  height: 18px;
  width: 12px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  animation: numberPulse 2s ease-in-out infinite;
}

/* 照片区域优化 */
.photo-area {
  position: absolute;
  top: 60px;
  right: 24px;
  width: 108px; /* 增加尺寸 */
  height: 144px; /* 增加尺寸 */
  background: rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.2); /* 添加边框 */
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
  border: 1px solid rgba(150, 100, 0, 0.5); /* 添加边框 */
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

/* 添加身份证防伪标记 */
.id-card-template::after {
  content: '';
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.05) 0%, transparent 70%);
  opacity: 0.7;
  border-radius: 50%;
  animation: antiCounterfeitPulse 4s ease-in-out infinite;
}

/* 添加防伪标记动画 */
@keyframes antiCounterfeitPulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

/* 按钮样式 */
.read-button {
  margin-top: 3.6rem; /* 从3rem放大到3.6rem */
  padding: 1.2rem 3.6rem; /* 从1rem 3rem放大到1.2rem 3.6rem */
  font-family: 'Orbitron', sans-serif;
  font-size: 29px; /* 从24px放大到29px */
  color: white;
  background: linear-gradient(135deg, #0072ff, #00c6ff);
  border: none;
  border-radius: 60px; /* 从50px放大到60px */
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 
    0 0 12px rgba(0, 162, 255, 0.5),
    0 0 24px rgba(0, 162, 255, 0.3);
  transform: translateZ(24px); /* 从translateZ(20px)放大到translateZ(24px) */
}

.read-button:hover:not(:disabled) {
  transform: translateZ(30px) scale(1.05);
  box-shadow: 
    0 0 15px rgba(0, 162, 255, 0.7),
    0 0 30px rgba(0, 162, 255, 0.5);
}

.read-button:active:not(:disabled) {
  transform: translateZ(10px) scale(0.95);
}

.read-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: linear-gradient(135deg, #90CAF9, #5C6BC0);
}

.button-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s;
}

.read-button:hover:not(:disabled) .button-glow {
  opacity: 0.3;
  animation: rotateGlow 3s linear infinite;
}
/* 动画定义 */
@keyframes chipPulse {
  0%, 100% { 
    opacity: 0.7; 
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
  50% { 
    opacity: 1; 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
  }
}

@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes dataFlow {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes rotateGlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes particleExpand {
  0% { 
    transform: translate(-50%, -50%) scale(0); 
    opacity: 0.8; 
  }
  100% { 
    transform: translate(-50%, -50%) scale(1); 
    opacity: 0; 
  }
}

/* 添加粒子动画效果 */
@keyframes particleFloat {
  0% { 
    transform: translate(0, 0); 
    opacity: 1;
  }
  100% { 
    transform: translate(var(--x), var(--y)); 
    opacity: 0;
  }
}

/* 添加3D翻转效果 */
@keyframes cardFlip {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(180deg); }
}

/* 添加全息网格动画 */
@keyframes hologramShift {
  0% { 
    background-position: 0 0; 
    opacity: 0.3;
  }
  50% { 
    opacity: 0.5;
  }
  100% { 
    background-position: 20px 20px; 
    opacity: 0.3;
  }
}

/* 添加成功状态粒子爆炸效果 */
@keyframes successParticles {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* 添加错误状态震动效果 */
@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

/* 添加按钮光晕效果 */
@keyframes buttonGlow {
  0% { box-shadow: 0 0 5px rgba(0, 162, 255, 0.5); }
  50% { box-shadow: 0 0 20px rgba(0, 162, 255, 0.8); }
  100% { box-shadow: 0 0 5px rgba(0, 162, 255, 0.5); }
}

/* 添加打字动画 */
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: rgba(0, 162, 255, 0.8) }
}

/* 添加边框发光动画 */
@keyframes borderGlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 添加网格脉冲动画 */
@keyframes gridPulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}

/* 添加信息占位符脉冲动画 */
@keyframes infoPulse {
  0%, 100% { opacity: 0.5; width: 80%; }
  50% { opacity: 0.8; width: 85%; }
}

/* 添加号码占位符脉冲动画 */
@keyframes numberPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

/* 添加照片区域闪烁动画 */
@keyframes photoShimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(30deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(30deg); }
}

/* 添加国徽脉冲动画 */
@keyframes emblemPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* 添加淡入上升动画 */
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

/* 添加读取状态动画 */
.id-card-placeholder.reading .id-card-template {
  animation: readingPulse 1.5s ease-in-out infinite;
}

@keyframes readingPulse {
  0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 255, 0.3); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.6); }
}

/* 添加成功状态动画 */
.id-card-placeholder.success .id-card-template {
  animation: successPulse 1.5s ease-out forwards;
}

@keyframes successPulse {
  0% { box-shadow: 0 0 10px rgba(0, 255, 128, 0.3); }
  50% { box-shadow: 0 0 30px rgba(0, 255, 128, 0.8); }
  100% { box-shadow: 0 0 15px rgba(0, 255, 128, 0.5); }
}

/* 添加错误状态动画 */
.id-card-placeholder.error .id-card-template {
  animation: errorPulse 0.5s ease-in-out 3, errorShake 0.5s ease-in-out 3;
}

@keyframes errorPulse {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 0, 128, 0.3); }
  50% { box-shadow: 0 0 30px rgba(255, 0, 128, 0.8); }
}
</style>