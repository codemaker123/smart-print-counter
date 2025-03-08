<template>
  <div class="page-title-container">
    <h1 class="page-title">智能自助打印平台</h1>
    <div class="title-underline"></div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');

.page-title-container {
  width: 100%;
  position: absolute;
  top: 10vh;
  left: 0;
  text-align: center;
  z-index: 50;
  animation: fadeInDown 0.8s ease-out;
}

.page-title {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 2.8rem;
  font-weight: 600;
  letter-spacing: 2px;
  margin: 0;
  text-shadow: 
    0 0 10px rgba(0, 162, 255, 0.6),
    0 0 20px rgba(0, 162, 255, 0.3);
  background: linear-gradient(90deg, #4FC3F7, #B3E5FC, #4FC3F7);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-underline {
  width: 180px;
  height: 3px;
  margin: 0.8rem auto 0;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(0, 162, 255, 0.8), 
    rgba(79, 195, 247, 1), 
    rgba(0, 162, 255, 0.8), 
    transparent);
  box-shadow: 
    0 0 8px rgba(0, 162, 255, 0.5),
    0 0 16px rgba(0, 162, 255, 0.3);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>