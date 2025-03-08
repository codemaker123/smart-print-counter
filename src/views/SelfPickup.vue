<template>
  <div class="self-pickup-container">
    <div class="header">
      <h1>委托自提</h1>
    </div>
    <div class="content">
      <div class="question-box">
        <h2>是否有预约码？</h2>
        <div class="options">
          <button class="option-btn yes-btn" @click="handleYes">是</button>
          <button class="option-btn no-btn" @click="handleNo">否</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelfPickup',
  methods: {
    handleYes() {
      // 处理有预约码的情况
      console.log('用户选择：有预约码');
      // 这里可以添加后续逻辑，如跳转到输入预约码的页面
    },
    handleNo() {
      // 处理没有预约码的情况
      console.log('用户选择：没有预约码');
      // 这里可以添加后续逻辑
    }
  }
}
</script>

<style scoped>
.self-pickup-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a2a6c, #2a3a7c);
  color: white;
  font-family: 'Arial', sans-serif;
}

.header {
  padding: 20px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 2.5rem;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.question-box {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.2);
  width: 80%;
  max-width: 600px;
}

.question-box h2 {
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 2rem;
  color: #00ffff;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

.options {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
}

.option-btn {
  padding: 15px 40px;
  font-size: 1.5rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-weight: bold;
  min-width: 150px;
}

.yes-btn {
  background: linear-gradient(135deg, #00b09b, #96c93d);
  box-shadow: 0 0 15px rgba(150, 201, 61, 0.5);
}

.no-btn {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  box-shadow: 0 0 15px rgba(255, 65, 108, 0.5);
}

.option-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.5);
}

.option-btn:active {
  transform: scale(0.98);
}
</style>