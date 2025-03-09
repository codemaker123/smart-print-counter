<template>
  <div class="self-pickup-container">
    <div class="header">
      <h1>委托自提</h1>
    </div>
    <div class="content">
      <div class="question-box">
        <h2 class="instruction-text">是否有预约码？</h2>
        <div class="options">
          <button class="option-btn yes-btn" @click="handleYes">
            <span class="button-text">是</span>
          </button>
          <button class="option-btn no-btn" @click="handleNo">
            <span class="button-text">否</span>
          </button>
        </div>
      </div>
    </div>
    <!-- 添加背景组件 -->
    <Background class="page-background" />
  </div>
</template>

<script>
import Background from '@/components/Background.vue';

export default {
  name: 'SelfPickup',
  components: {
    Background
  },
  methods: {
    handleYes() {
      // 处理有预约码的情况
      console.log('用户选择：有预约码');
      // 跳转到信息录入页面，并传递参数表示有预约码
      this.$router.push({ path: '/info-entry', query: { hasReservation: 'true' } });
    },
    handleNo() {
      // 处理没有预约码的情况
      console.log('用户选择：没有预约码');
      // 跳转到信息录入页面，并传递参数表示没有预约码
      this.$router.push({ path: '/info-entry', query: { hasReservation: 'false' } });
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');

.self-pickup-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* 移除原有背景，使用Background组件 */
  color: white;
  font-family: 'Noto Sans SC', sans-serif;
  position: relative;
  overflow: hidden;
}

/* 添加背景组件样式 */
.page-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.header {
  padding: 80px 20px 40px;
  text-align: center;
  position: relative;
  z-index: 10;
}

.header h1 {
  margin: 0;
  font-size: 2.8rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-shadow: 
    0 0 10px rgba(0, 162, 255, 0.6),
    0 0 20px rgba(0, 162, 255, 0.3);
  color: #4FC3F7;
  transform: translateY(100px);
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  padding-top: 0;
  margin-top: -120px;
  perspective: 1200px;
}

.question-box {
  width: 960px;
  height: 500px;
  padding: 80px;
  text-align: center;
  background: rgba(240, 244, 255, 0.1); /* 降低透明度 */
  border-radius: 29px;
  box-shadow: 
    0 0 36px rgba(120, 160, 255, 0.2), /* 调低亮度 */
    0 0 72px rgba(120, 160, 255, 0.05); /* 调低亮度 */
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15); /* 调低亮度 */
  background-image: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(255, 255, 255, 0.15) 100%); /* 调低亮度 */
  transition: all 0.5s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.question-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.07) 0%, /* 调低亮度 */
    rgba(255, 255, 255, 0.03) 50%, /* 调低亮度 */
    rgba(255, 255, 255, 0) 100%
  );
  z-index: 1;
  pointer-events: none;
}

.instruction-text {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 38px;
  color: #fff;
  margin-bottom: 80px;
  text-shadow: 
    0 0 6px rgba(120, 160, 255, 0.6), /* 调低亮度 */
    0 0 12px rgba(120, 160, 255, 0.3); /* 调低亮度 */
  letter-spacing: 1.2px;
  text-align: center;
  position: relative;
  z-index: 10;
  transition: all 0.5s ease;
}

.options {
  display: flex;
  justify-content: space-around;
  margin-top: 50px;
  position: relative;
  z-index: 10;
}

.option-btn {
  padding: 1.5rem 4rem;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 32px;
  border: none;
  border-radius: 60px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  color: white;
  font-weight: bold;
  min-width: 220px;
  transform: translateZ(24px);
}

.yes-btn {
  background: linear-gradient(135deg, #0072ff, #00c6ff);
  box-shadow: 
    0 0 8px rgba(0, 162, 255, 0.3), /* 调低亮度 */
    0 0 16px rgba(0, 162, 255, 0.2); /* 调低亮度 */
}

.no-btn {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  box-shadow: 
    0 0 8px rgba(255, 65, 108, 0.3), /* 调低亮度 */
    0 0 16px rgba(255, 65, 108, 0.2); /* 调低亮度 */
}

.option-btn:hover {
  transform: translateZ(30px) scale(1.05);
}

.yes-btn:hover {
  box-shadow: 
    0 0 10px rgba(0, 162, 255, 0.5), /* 调低亮度 */
    0 0 20px rgba(0, 162, 255, 0.3); /* 调低亮度 */
}

.no-btn:hover {
  box-shadow: 
    0 0 10px rgba(255, 65, 108, 0.5), /* 调低亮度 */
    0 0 20px rgba(255, 65, 108, 0.3); /* 调低亮度 */
}

.option-btn:active {
  transform: translateZ(10px) scale(0.95);
}

@keyframes rotateGlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>