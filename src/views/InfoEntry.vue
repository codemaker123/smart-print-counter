<template>
  <div class="info-entry-container">
    <div class="header">
      <h1>信息录入</h1>
    </div>
    <div class="content">
      <div class="question-box">
        <div class="input-container">
          <label for="reservation-code">{{ firstFieldLabel }}</label>
          <input 
            type="text" 
            id="reservation-code" 
            v-model="firstFieldValue" 
            :placeholder="firstFieldPlaceholder"
            @click="focusFirstField"
            readonly
          />
        </div>
        <div class="input-container">
          <label for="license-plate">车牌号码</label>
          <div class="license-plate-input">
            <!-- 省份选择框 -->
            <div class="province-selector" @click="showProvinceSelector = true">
              <span v-if="licensePlate.province">{{ licensePlate.province }}</span>
              <span v-else class="placeholder">省份</span>
            </div>
            <!-- 字母和数字部分 - 改为分格式输入 -->
            <div class="plate-number-grid">
              <div 
                v-for="(char, index) in plateChars" 
                :key="index"
                class="plate-char-box"
                :class="{ active: currentFocusIndex === index }"
                @click="focusCharBox(index)"
              >
                {{ char || '' }}
              </div>
            </div>
          </div>
        </div>
        <div class="options">
          <button class="option-btn yes-btn" @click="handleSubmit">
            <span class="button-text">提交</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 省份选择弹出框 -->
    <div class="province-modal" v-if="showProvinceSelector">
      <div class="province-modal-content">
        <div class="province-modal-header">
          <h3>选择省份</h3>
          <button class="close-btn" @click="showProvinceSelector = false">&times;</button>
        </div>
        <div class="province-grid">
          <button 
            v-for="province in provinces" 
            :key="province" 
            class="province-btn"
            @click="selectProvince(province)"
          >
            {{ province }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 使用虚拟键盘组件 -->
    <VirtualKeyboard 
      :visible="showKeyboard"
      :title="keyboardTitle"
      @input="handleKeyboardInput"
      @delete="handleKeyboardDelete"
      @close="showKeyboard = false"
    />
    
    <!-- 添加背景组件 -->
    <Background class="page-background" />
  </div>
</template>

<script>
import Background from '@/components/Background.vue';
import VirtualKeyboard from '@/components/VirtualKeyboard.vue';

export default {
  name: 'InfoEntry',
  components: {
    Background,
    VirtualKeyboard
  },
  data() {
    return {
      firstFieldValue: '',
      licensePlate: {
        province: '',
        number: ''
      },
      plateChars: ['', '', '', '', '', ''], // 6个字符的数组
      currentFocusIndex: -1, // 当前聚焦的字符框索引
      hasReservation: true,
      showProvinceSelector: false,
      showKeyboard: false,
      provinces: ['京', '津', '冀', '晋', '蒙', '辽', '吉', '黑', '沪', '苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '桂', '琼', '渝', '川', '贵', '云', '藏', '陕', '甘', '青', '宁', '新'],
      keyboardTitle: '请输入车牌字符',
      inputType: 'plate' // 'plate' 或 'code'
    }
  },
  computed: {
    firstFieldLabel() {
      return this.hasReservation ? '输入预约码' : '发货单号';
    },
    firstFieldPlaceholder() {
      return this.hasReservation ? '请输入预约码' : '请输入发货单号';
    },
    fullLicensePlate() {
      return this.licensePlate.province + this.plateChars.join('');
    }
  },
  watch: {
    plateChars: {
      handler(newVal) {
        this.licensePlate.number = newVal.join('');
      },
      deep: true
    }
  },
  created() {
    // 从路由参数中获取是否有预约码的信息
    const hasReservation = this.$route.query.hasReservation;
    this.hasReservation = hasReservation === 'true';
  },
  methods: {
    selectProvince(province) {
      this.licensePlate.province = province;
      this.showProvinceSelector = false;
      
      // 使用 nextTick 确保 DOM 更新后再聚焦
      this.$nextTick(() => {
        this.focusCharBox(0);
      });
    },
    focusCharBox(index) {
      this.currentFocusIndex = index;
      this.inputType = 'plate';
      this.keyboardTitle = '请输入车牌字符';
      this.showKeyboard = true;
    },
    inputChar(char) {
      if (this.currentFocusIndex >= 0 && this.currentFocusIndex < this.plateChars.length) {
        try {
          // 在 Vue 3 中直接使用数组索引赋值即可
          this.plateChars[this.currentFocusIndex] = char;
          
          // 自动移动到下一个输入框
          if (this.currentFocusIndex < this.plateChars.length - 1) {
            this.currentFocusIndex++;
          }
        } catch (error) {
          console.error('更新车牌字符时出错:', error);
        }
      }
    },
    deleteChar() {
      if (this.currentFocusIndex >= 0) {
        try {
          // 在 Vue 3 中直接使用数组索引赋值即可
          this.plateChars[this.currentFocusIndex] = '';
          
          // 如果不是第一个字符，则移动到前一个
          if (this.currentFocusIndex > 0) {
            this.currentFocusIndex--;
          }
        } catch (error) {
          console.error('删除车牌字符时出错:', error);
        }
      }
    },
    handleSubmit() {
      // 处理提交信息的逻辑
      const fieldType = this.hasReservation ? '预约码' : '发货单号';
      console.log(`提交的${fieldType}:`, this.firstFieldValue);
      console.log('提交的车牌号码:', this.fullLicensePlate);
      
      // 验证车牌号是否完整
      if (!this.licensePlate.province) {
        alert('请选择车牌省份');
        return;
      }
      
      // 检查是否所有字符都已输入
      if (this.plateChars.some(char => !char)) {
        alert('请输入完整的车牌号码');
        return;
      }
      
      // 这里可以添加后续逻辑，如验证和提交数据
      // 模拟客户ID，实际应用中应该从后端获取
      const customerId = 'customer_' + Date.now();
      
      // 跳转到文档列表页面，并传递客户ID参数
      this.$router.push({ 
        path: '/document-list', 
        query: { 
          customerId: customerId,
          licensePlate: this.fullLicensePlate,
          fieldValue: this.firstFieldValue
        } 
      });
    },
    focusFirstField() {
      // 设置输入类型为预约码/发货单号
      this.inputType = 'code';
      this.keyboardTitle = this.hasReservation ? '请输入预约码' : '请输入发货单号';
      this.showKeyboard = true;
    },
    handleKeyboardInput(char) {
      if (this.inputType === 'plate') {
        this.inputChar(char);
      } else if (this.inputType === 'code') {
        // 直接添加到预约码/发货单号输入框
        this.firstFieldValue += char;
      }
    },
    handleKeyboardDelete() {
      if (this.inputType === 'plate') {
        this.deleteChar();
      } else if (this.inputType === 'code') {
        // 删除预约码/发货单号的最后一个字符
        this.firstFieldValue = this.firstFieldValue.slice(0, -1);
      }
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

/* 车牌号输入样式 - 修改为分格式 */
.license-plate-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.province-selector {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  background: rgba(0, 162, 255, 0.2);
  border: 1px solid rgba(0, 162, 255, 0.4);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 162, 255, 0.2);
  text-shadow: 0 0 10px rgba(0, 162, 255, 0.8);
}

.province-selector:hover {
  background: rgba(0, 162, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 162, 255, 0.4);
}

.province-selector .placeholder {
  font-size: 16px;
  opacity: 0.7;
}

/* 新增分格式车牌输入样式 */
.plate-number-grid {
  display: flex;
  flex: 1;
  gap: 8px;
}

.plate-char-box {
  flex: 1;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  text-transform: uppercase;
}

.plate-char-box:hover {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 15px rgba(0, 162, 255, 0.2);
}

.plate-char-box.active {
  animation: activePulse 1s ease infinite alternate;
}

@keyframes activePulse {
  0% { transform: scale(1); box-shadow: 0 0 15px rgba(0,162,255,0.3); }
  100% { transform: scale(1.05); box-shadow: 0 0 25px rgba(0,162,255,0.5); }
}

/* 添加高科技感的动画效果 */
@keyframes pulse {
  0% { box-shadow: 0 0 8px rgba(0, 162, 255, 0.3), 0 0 16px rgba(0, 162, 255, 0.2); }
  50% { box-shadow: 0 0 15px rgba(0, 162, 255, 0.5), 0 0 30px rgba(0, 162, 255, 0.3); }
  100% { box-shadow: 0 0 8px rgba(0, 162, 255, 0.3), 0 0 16px rgba(0, 162, 255, 0.2); }
}

.yes-btn {
  background: linear-gradient(135deg, #0072ff, #00c6ff);
  box-shadow: 
    0 0 8px rgba(0, 162, 255, 0.3),
    0 0 16px rgba(0, 162, 255, 0.2);
  animation: pulse 3s infinite;
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

.option-btn:hover {
  transform: translateZ(30px) scale(1.05);
}

.option-btn:active {
  transform: translateZ(10px) scale(0.95);
}

/* 输入框聚焦时的高亮效果 */
.input-container input:focus {
  animation: inputGlow 2s infinite alternate;
}

@keyframes inputGlow {
  from { box-shadow: 0 0 15px rgba(0, 162, 255, 0.3); }
  to { box-shadow: 0 0 25px rgba(0, 162, 255, 0.5); }
}

/* 省份选择按钮点击效果 */
.province-btn:active {
  transform: scale(0.95);
  background: rgba(0, 162, 255, 0.4);
}

/* 车牌输入框的空格提示 */
.plate-char-box:empty::before {
  content: '';
  width: 20px;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  position: absolute;
}
@media (max-width: 480px) {
  .province-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .license-plate-input {
    flex-direction: column;
    align-items: stretch;
  }
  
  .province-selector {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .plate-char-box {
    height: 50px;
    font-size: 20px;
  }
}

/* 省份选择弹出框样式 */
.province-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.province-modal-content {
  width: 90%;
  max-width: 600px;
  background: rgba(20, 30, 48, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 
    0 0 30px rgba(0, 162, 255, 0.3),
    0 0 60px rgba(0, 162, 255, 0.1);
  border: 1px solid rgba(0, 162, 255, 0.2);
}

.province-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(0, 162, 255, 0.2);
  padding-bottom: 15px;
}

.province-modal-header h3 {
  font-size: 24px;
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

.province-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.province-btn {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  background: rgba(0, 162, 255, 0.1);
  border: 1px solid rgba(0, 162, 255, 0.3);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.province-btn:hover {
  background: rgba(0, 162, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 162, 255, 0.3);
  transform: translateY(-2px);
}

/* 提交按钮容器 */
.options {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

/* 添加车牌字符框的空格提示 - 确保居中 */
.plate-char-box:empty::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
}

/* 确保车牌字符框内容居中显示 */
.plate-char-box {
  position: relative;
}

/* 添加按键按下时的涟漪效果 */
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

/* 确保省份选择器在移动设备上正确显示 */
@media (max-width: 480px) {
  .province-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .province-modal-content {
    padding: 20px 15px;
  }
  
  .province-btn {
    height: 45px;
    font-size: 18px;
  }
}
</style>

