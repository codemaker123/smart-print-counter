<template>
  <div class="id-card-reader-container" ref="containerRef">
    <!-- 背景动画层 -->
    <div class="background-layer">
      <canvas ref="threeCanvas" class="three-canvas"></canvas>
      <canvas ref="particleCanvas" class="particle-canvas"></canvas>
      <div class="grid-overlay"></div>
    </div>
    
    <!-- 标题 -->
    <h1 class="page-title">身份证自助读取系统</h1>
    
    <!-- 扫描区域 -->
    <div 
      class="scanner-container" 
      role="region" 
      aria-label="身份证定位引导区域"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <div class="scanner-inner">
        <div class="scan-line"></div>
        <div class="corner-point" v-for="(position, index) in cornerPositions" 
             :key="index" 
             :style="position"></div>
      </div>
      <div class="scanner-status" :class="{ 'success': scanSuccess }">
        {{ scanStatusText }}
      </div>
    </div>

    <!-- 操作按钮 -->
    <button class="scan-button" @click="handleScanButtonClick">
      <span class="button-text">开始读取</span>
      <div class="button-glow"></div>
    </button>
  </div>
</template>

<style scoped>
.id-card-reader-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: linear-gradient(45deg, #1A237E, #0D47A1, #000814);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(to right, rgba(33, 150, 243, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(33, 150, 243, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%);
}

.page-title {
  color: #fff;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 500;
  text-shadow: 0 0 20px rgba(33, 150, 243, 0.8);
  z-index: 1;
}

.scanner-container {
  position: relative;
  width: 600px;
  height: 400px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 40px rgba(33, 150, 243, 0.3);
  z-index: 1;
  padding: 20px;
}

.scanner-inner {
  width: 100%;
  height: 100%;
  border: 2px solid rgba(33, 150, 243, 0.8);  // 保持蓝色边框
  position: relative;
  overflow: hidden;
}

.scan-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #2196F3, transparent);  // 改为蓝色扫描线
  animation: scanAnimation 2s linear infinite;
}

.corner-point {
  width: 12px;
  height: 12px;
  background: #2196F3;  // 蓝色定位点
  border-radius: 50%;
  position: absolute;
  box-shadow: 0 0 15px #2196F3;  // 蓝色发光效果
  animation: pulseAnimation 2s ease-in-out infinite;
}

.scanner-status {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 1.2rem;
  text-shadow: 0 0 10px rgba(33, 150, 243, 0.8);
}

.scan-button {
  position: relative;
  margin-top: 80px;
  width: 200px;
  height: 60px;
  background: linear-gradient(45deg, #4FC3F7, #2962FF);
  border: none;
  border-radius: 30px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  overflow: hidden;
  z-index: 1;
  transition: all 0.3s ease;
}

.scan-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(33, 150, 243, 0.6);
}

.button-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s;
}

.scan-button:hover .button-glow {
  opacity: 0.3;
  animation: rotateGlow 3s linear infinite;
}

@keyframes scanAnimation {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes pulseAnimation {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

@keyframes rotateGlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<script>
import * as THREE from 'three';
import anime from 'animejs';
import { ref, onMounted } from 'vue';

export default {
  name: 'IdCardReader',
  setup() {
    const containerRef = ref(null);
    const threeCanvas = ref(null);
    const particleCanvas = ref(null);
    const isHovering = ref(false);
    const scanSuccess = ref(false);
    const scanError = ref(false);
    const scanStatusText = ref('请将身份证放入读取区域');
    const isScanning = ref(false);
    const buttonText = ref('开始读取');

    const cornerPositions = [
      { top: '-5px', left: '-5px' },
      { top: '-5px', right: '-5px' },
      { bottom: '-5px', left: '-5px' },
      { bottom: '-5px', right: '-5px' }
    ];

    const initThreeJS = () => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        canvas: threeCanvas.value,
        alpha: true 
      });
      renderer.setSize(window.innerWidth, window.innerHeight);

      const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 20, 20);
      const material = new THREE.MeshPhongMaterial({
        color: 0x2196F3,
        wireframe: true,
        transparent: true,
        opacity: 0.1
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(0, 1, 1);
      scene.add(light);

      camera.position.z = 500;

      const animate = () => {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.001;
        mesh.rotation.y += 0.001;
        renderer.render(scene, camera);
      };

      animate();
    };

    const initParticles = () => {
      const canvas = particleCanvas.value;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const particleCount = 100;

      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 3 + 1;
          this.speedX = Math.random() * 3 - 1.5;
          this.speedY = Math.random() * 3 - 1.5;
        }

        update() {
          this.x += this.speedX;
          this.y += this.speedY;

          if (this.x > canvas.width) this.x = 0;
          if (this.x < 0) this.x = canvas.width;
          if (this.y > canvas.height) this.y = 0;
          if (this.y < 0) this.y = canvas.height;
        }

        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = '#4FC3F7';
          ctx.fill();
        }
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }

      const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
          particle.update();
          particle.draw();
        });
        requestAnimationFrame(animateParticles);
      };

      animateParticles();
    };

    // 播放扫描音效
    const playCardScanSound = () => {
      try {
        const audio = new Audio();
        audio.src = '/sounds/card-scan.mp3'; // 需要添加相应的音效文件
        audio.volume = 0.5;
        audio.play().catch(e => console.log('音频播放失败:', e));
      } catch (error) {
        console.error('播放音效失败:', error);
      }
    };

    // 播放成功音效
    const playSuccessSound = () => {
      try {
        const audio = new Audio();
        audio.src = '/sounds/success.mp3'; // 需要添加相应的音效文件
        audio.volume = 0.5;
        audio.play().catch(e => console.log('音频播放失败:', e));
      } catch (error) {
        console.error('播放音效失败:', error);
      }
    };

    // 播放错误音效
    const playErrorSound = () => {
      try {
        const audio = new Audio();
        audio.src = '/sounds/error.mp3'; // 需要添加相应的音效文件
        audio.volume = 0.5;
        audio.play().catch(e => console.log('音频播放失败:', e));
      } catch (error) {
        console.error('播放音效失败:', error);
      }
    };

    // 处理扫描按钮点击
    const handleScanButtonClick = () => {
      if (isScanning.value) return;
      
      isScanning.value = true;
      scanSuccess.value = false;
      scanError.value = false;
      buttonText.value = '读取中...';
      scanStatusText.value = '正在读取身份证信息，请稍候';
      
      // 播放扫描音效
      playCardScanSound();
      
      // 按钮动画
      anime({
        targets: '.scan-button',
        scale: [1, 1.1],
        opacity: [1, 0.8],
        duration: 1000,
        easing: 'easeOutExpo'
      });
      
      // 扫描动画
      anime({
        targets: '.scanner-inner',
        boxShadow: [
          '0 0 5px rgba(33, 150, 243, 0.5)',
          '0 0 20px rgba(33, 150, 243, 0.8)',
          '0 0 5px rgba(33, 150, 243, 0.5)'
        ],
        duration: 3000,
        easing: 'easeInOutQuad'
      });
      
      // 模拟扫描过程
      setTimeout(() => {
        isScanning.value = false;
        const isSuccessful = Math.random() > 0.3;
        
        if (isSuccessful) {
          scanSuccess.value = true;
          scanError.value = false;
          scanStatusText.value = '读取成功';
          playSuccessSound();
          
          // 成功动画
          anime({
            targets: '.scanner-inner',
            boxShadow: [
              '0 0 5px rgba(76, 175, 80, 0.5)',
              '0 0 20px rgba(76, 175, 80, 0.8)',
              '0 0 5px rgba(76, 175, 80, 0.5)'
            ],
            duration: 1000,
            easing: 'easeOutExpo'
          });
        } else {
          scanSuccess.value = false;
          scanError.value = true;
          scanStatusText.value = '读取失败，请重试';
          playErrorSound();
          
          // 失败动画
          anime({
            targets: '.scanner-inner',
            boxShadow: [
              '0 0 5px rgba(244, 67, 54, 0.5)',
              '0 0 20px rgba(244, 67, 54, 0.8)',
              '0 0 5px rgba(244, 67, 54, 0.5)'
            ],
            duration: 1000,
            easing: 'easeOutExpo'
          });
        }
        
        buttonText.value = '开始读取';
      }, 3000);
    };

    // 添加窗口大小调整监听
    const handleResize = () => {
      if (threeCanvas.value && particleCanvas.value) {
        const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas.value, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        particleCanvas.value.width = window.innerWidth;
        particleCanvas.value.height = window.innerHeight;
      }
    };

    onMounted(() => {
      initThreeJS();
      initParticles();
      
      window.addEventListener('resize', handleResize);
      
      // 组件卸载时移除事件监听
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    });

    return {
      containerRef,
      threeCanvas,
      particleCanvas,
      isHovering,
      isScanning,
      scanSuccess,
      scanError,
      scanStatusText,
      buttonText,
      cornerPositions,
      handleScanButtonClick
    };
  }
};
</script>