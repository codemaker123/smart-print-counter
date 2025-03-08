<template>
  <header class="header">
    <h1 class="title">身份证自助读取系统</h1>
  </header>
</template>

<style scoped>
.header {
  background: linear-gradient(to right, #1E3A8A, #60A5FA);
  padding: 1rem;
  animation: slideDown 0.8s ease-in-out;
}

.title {
  color: white;
  font-size: 32px;
  text-align: center;
  font-weight: bold;
}

@keyframes slideDown {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>