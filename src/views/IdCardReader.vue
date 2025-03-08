<template>
  <div class="app-container">
    <PageTitle />
    <Background />
    <CardReader />
  </div>
</template>

<script>
// 修改导入路径
import PageTitle from '@/components/PageTitle.vue'
import Background from '@/components/Background.vue'
import CardReader from '@/components/CardReader.vue'

export default {
  name: 'IdCardReader',
  components: {
    PageTitle,
    Background,
    CardReader
  }
}
</script>

<style scoped>
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
