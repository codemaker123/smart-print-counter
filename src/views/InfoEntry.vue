<template>
  <div class="info-entry-container">
    <div class="header">
      <h1>信息录入</h1>
    </div>
    <div class="content">
      <div class="question-box">
        <div class="input-container">
          <label for="reservation-code">输入预约码</label>
          <input 
            type="text" 
            id="reservation-code" 
            v-model="reservationCode" 
            placeholder="请输入预约码"
          />
        </div>
        <div class="input-container">
          <label for="license-plate">车牌号码</label>
          <input 
            type="text" 
            id="license-plate" 
            v-model="licensePlate" 
            placeholder="请输入车牌号码"
          />
        </div>
        <div class="options">
          <button class="option-btn yes-btn" @click="handleSubmit">
            <span class="button-text">提交</span>
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
  name: 'InfoEntry',
  components: {
    Background
  },
  data() {
    return {
      reservationCode: '',
      licensePlate: ''
    }
  },
  methods: {
    handleSubmit() {
      // 处理提交信息的逻辑
      console.log('提交的预约码:', this.reservationCode);
      console.log('提交的车牌号码:', this.licensePlate);
      // 这里可以添加后续逻辑，如验证和提交数据
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');

.info-entry-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: white;
  font-family: 'Noto Sans SC', sans-serif;
  position: relative;
  overflow: hidden;
}

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
  background: rgba(240, 244, 255, 0.1);
  border-radius: 29px;
  box-shadow: 
    0 0 36px rgba(120, 160, 255, 0.2),
    0 0 72px rgba(120, 160, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  background-image: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(255, 255, 255, 0.15) 100%);
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
    rgba(255, 255, 255, 0.07) 0%,
    rgba(255, 255, 255, 0.03) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  z-index: 1;
  pointer-events: none;
}

.input-container {
  margin-bottom: 30px;
  text-align: left;
  position: relative;
  z-index: 10;
}

.input-container label {
  display: block;
  font-size: 24px;
  margin-bottom: 10px;
  color: #fff;
  text-shadow: 0 0 6px rgba(120, 160, 255, 0.6);
}

.input-container input {
  width: 100%;
  padding: 15px 20px;
  font-size: 20px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 162, 255, 0.1);
}

.input-container input:focus {
  border-color: rgba(0, 162, 255, 0.5);
  box-shadow: 0 0 15px rgba(0, 162, 255, 0.3);
}

.input-container input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.options {
  display: flex;
  justify-content: center;
  margin-top: 40px;
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
    0 0 8px rgba(0, 162, 255, 0.3),
    0 0 16px rgba(0, 162, 255, 0.2);
}

.option-btn:hover {
  transform: translateZ(30px) scale(1.05);
}

.yes-btn:hover {
  box-shadow: 
    0 0 10px rgba(0, 162, 255, 0.5),
    0 0 20px rgba(0, 162, 255, 0.3);
}

.option-btn:active {
  transform: translateZ(10px) scale(0.95);
}
</style>