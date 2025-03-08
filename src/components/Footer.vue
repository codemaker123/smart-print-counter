<template>
  <footer class="footer">
    <p class="status">{{ status }}</p>
  </footer>
</template>

<script setup/>

<style scoped>
.footer {
  height: 50px;
  background-color: #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status {
  font-size: 14px;
  color: #374151;
  transition: opacity 0.5s ease;
}
</style>