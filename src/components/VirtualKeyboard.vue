<template>
  <div class="keyboard-modal" v-if="visible" @click.self="handleOutsideClick">
    <div class="keyboard-modal-content" @click.stop>
      <div class="keyboard-modal-header">
        <h3>{{ title || '请输入字符' }}</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>
      <div class="keyboard-grid">
        <div class="keyboard-row" v-for="(row, rowIndex) in keyboardRows" :key="rowIndex">
          <button 
            v-for="key in row" 
            :key="key"
            class="keyboard-key"
            :class="{ 
              'pressed': keyPressStates[key],
              'keyboard-key-wide': ['删除', '完成'].includes(key)
            }"
            @click.stop="handleKeyPress(key)"
          >
            {{ key }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VirtualKeyboard',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '请输入字符'
    }
  },
  data() {
    return {
      keyPressStates: {},
      keyboardRows: [
        ['Q','W','E','R','T','Y','U','I','O','P'],
        ['A','S','D','F','G','H','J','K','L'],
        ['Z','X','C','V','B','N','M'],
        ['1','2','3','4','5','6','7','8','9','0'],
        ['删除', '完成']
      ]
    }
  },
  methods: {
    handleKeyPress(key) {
      // 添加按键按下效果
      this.keyPressStates = {}; // 先清空所有状态
      this.keyPressStates[key] = true;
      
      setTimeout(() => {
        this.keyPressStates[key] = false;
      }, 300);
      
      if (key === '删除') {
        this.$emit('delete');
      } else if (key === '完成') {
        this.$emit('close');
      } else {
        this.$emit('input', key);
      }
    },
    handleOutsideClick(event) {
      // 只有当点击的是键盘上方的区域时才关闭键盘
      // 获取点击位置和键盘内容区域的位置
      const contentRect = this.$el.querySelector('.keyboard-modal-content').getBoundingClientRect();
      const clickY = event.clientY;
      
      // 如果点击位置在键盘内容区域上方，才关闭键盘
      if (clickY < contentRect.top) {
        this.$emit('close');
      }
    }
  }
}
</script>

<style scoped>
/* 虚拟键盘样式 */
.keyboard-modal {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: transparent; /* 改为透明背景 */
  backdrop-filter: blur(5px); /* 减轻模糊效果 */
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
  animation: keyboardSlideUp 0.3s ease;
}

@keyframes keyboardSlideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.keyboard-modal-content {
  width: 100%;
  max-width: 900px;
  background: rgba(20, 30, 48, 0.85); /* 稍微降低不透明度 */
  border-radius: 20px 20px 0 0;
  padding: 20px;
  box-shadow: 
    0 -5px 30px rgba(0, 162, 255, 0.3),
    0 -10px 60px rgba(0, 162, 255, 0.1);
  border-top: 1px solid rgba(0, 162, 255, 0.2);
  border-left: 1px solid rgba(0, 162, 255, 0.2);
  border-right: 1px solid rgba(0, 162, 255, 0.2);
}

.keyboard-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(0, 162, 255, 0.2);
  padding-bottom: 10px;
}

.keyboard-modal-header h3 {
  font-size: 20px;
  color: #4FC3F7;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 162, 255, 0.5);
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.keyboard-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.keyboard-key {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: bold;
  background: rgba(0, 162, 255, 0.15);
  border: 1px solid rgba(0, 162, 255, 0.3);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
}

.keyboard-key:hover {
  background: rgba(0, 162, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 162, 255, 0.3);
  transform: translateY(-2px);
}

.keyboard-key:active, 
.keyboard-key.pressed {
  transform: translateY(1px);
  background: rgba(0, 162, 255, 0.4);
  box-shadow: 0 0 20px rgba(0, 162, 255, 0.6);
}

.keyboard-key-wide {
  width: 120px;
}

/* 键盘按键按下时的光效 */
@keyframes keyPress {
  0% { 
    box-shadow: 0 0 0 rgba(0, 162, 255, 0); 
    background: rgba(0, 162, 255, 0.4);
  }
  50% { 
    box-shadow: 0 0 20px rgba(0, 162, 255, 0.6); 
    background: rgba(0, 162, 255, 0.5);
  }
  100% { 
    box-shadow: 0 0 0 rgba(0, 162, 255, 0); 
    background: rgba(0, 162, 255, 0.4);
  }
}

.keyboard-key.pressed {
  animation: keyPress 0.3s ease;
  background: rgba(0, 162, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 162, 255, 0.6);
  transform: translateY(1px);
}

/* 添加按键按下时的涟漪效果 */
.keyboard-key.pressed::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.8);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1);
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(40);
    opacity: 0;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .keyboard-key {
    width: 50px;
    height: 50px;
    font-size: 18px;
  }
  
  .keyboard-key-wide {
    width: 100px;
  }
}

@media (max-width: 480px) {
  .keyboard-key {
    width: 40px;
    height: 45px;
    font-size: 16px;
    border-radius: 6px;
  }
  
  .keyboard-key-wide {
    width: 80px;
  }
  
  .keyboard-modal-content {
    padding: 15px 10px;
  }
}
</style>