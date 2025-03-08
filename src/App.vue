<template>
  <div class="app-container">
    <!-- <Header /> -->
    <PageTitle />
    <Background />
    <CardReader />
    <!-- <Footer :status="systemStatus" /> -->
  </div>
</template>

<script setup>
// import { ref } from 'vue'
// import Header from './components/Header.vue'
import PageTitle from './components/PageTitle.vue'
import Background from './components/Background.vue'
import CardReader from './components/CardReader.vue'
// import Footer from './components/Footer.vue'

// const systemStatus = ref('系统就绪')
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Microsoft YaHei", sans-serif;
}
</style>
