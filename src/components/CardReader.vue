<template>
  <div class="card-reader-container">
    <div class="card-reader">
      <div class="id-card-icon" :class="{ 'reading': isReading }">
        <div class="scan-line" v-if="isReading"></div>
        <div class="scan-line-notreading" v-else></div>
      </div>
      <p class="status-text" :class="{ 'error': hasError, 'success': isSuccess }">
        {{ statusText }}
      </p>
      <button 
        @click="startReading" 
        :disabled="isReading"
        class="read-button"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isReading = ref(false)
const hasError = ref(false)
const isSuccess = ref(false)
const buttonText = ref('开始读取')
const statusText = ref('请将身份证放置在读取区域')

const startReading = () => {
  isReading.value = true
  hasError.value = false
  isSuccess.value = false
  buttonText.value = '读取中...'
  statusText.value = '正在读取身份证信息，请稍候'

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
</script>

<style scoped>
.card-reader-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  animation: fadeInUp 1s ease-out;
  position: relative;
  z-index: 10; /* 确保在背景之上 */
}

.card-reader {
  width: 800px;
  height: 600px;
  background: rgba(255, 255, 255, 0.9); /* 稍微透明以便看到背景 */
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  backdrop-filter: blur(5px); /* 添加毛玻璃效果 */
}
  /*
  未读取时身份证边框
   */
.id-card-icon {
  width: 400px;  /* 从 200px 改为 400px */
  height: 240px; /* 从 120px 改为 240px */
  border: 6px solid #8c9597;  /* 从 3px 改为 6px */
  border-radius: 16px;  /* 从 8px 改为 16px */
  position: relative;
  animation: breathe 1.5s infinite;
}

.status-text {
  margin: 2rem 0;  /* 从 1rem 改为 2rem */
  font-size: 32px;  /* 从 16px 改为 32px */
  color: #666;
}

.read-button {
  padding: 1.5rem 4rem;  /* 从 0.75rem 2rem 改为 1.5rem 4rem */
  font-size: 36px;  /* 从 18px 改为 36px */
  border-radius: 16px;  /* 从 8px 改为 16px */
}

/*
读取时身份证边框
 */
.id-card-icon.reading {
  border-color: #3bf673;
}

/*
读取时身份证边框扫描线
 */
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #3bf673;
  animation: scan 1.5s linear infinite;
}

/*
未读取时身份证边框扫描线
 */
.scan-line-notreading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #8c9597;
  animation: scan 1.5s linear infinite;
}

.status-text {
  margin: 1rem 0;
  font-size: 16px;
  color: #666;
}

.status-text.error {
  color: #DC2626;
}

.status-text.success {
  color: #059669;
}

.read-button {
  padding: 0.75rem 2rem;
  font-size: 18px;
  color: white;
  background-color: #3B82F6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.read-button:hover:not(:disabled) {
  background-color: #2563EB;
  transform: scale(1.05);
}

.read-button:active:not(:disabled) {
  transform: scale(0.95);
}

.read-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@keyframes breathe {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
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
</style>