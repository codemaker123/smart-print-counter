<template>
  <div class="background">
    <canvas ref="particleCanvas" class="particle-canvas"></canvas>
    <div class="grid-overlay"></div>
    <div class="glow-effects">
      <div class="glow-circle"></div>
      <div class="glow-circle"></div>
      <div class="glow-circle"></div>
    </div>
    <div class="tech-elements">
      <div class="circuit-lines"></div>
      <div class="data-flow"></div>
      <div class="wave-effect"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const particleCanvas = ref(null);
let animationFrame = null;

const initParticles = () => {
  const canvas = particleCanvas.value;
  const ctx = canvas.getContext('2d');
  
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  const particleCount = 150; // 增加粒子数量
  const connectionDistance = 150; // 粒子之间连线的最大距离

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      this.opacity = Math.random() * 0.5 + 0.3;
      // 添加粒子形状变化
      this.shape = Math.random() > 0.7 ? 'circle' : 'square';
      // 添加粒子颜色变化
      this.color = Math.random() > 0.5 ? 
        `rgba(33, 150, 243, ${this.opacity})` : 
        `rgba(100, 181, 246, ${this.opacity})`;
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
      if (this.shape === 'circle') {
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      } else {
        ctx.rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
      }
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // 创建粒子
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // 绘制粒子之间的连线
  const connectParticles = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance) {
          // 根据距离计算线条透明度
          const opacity = 1 - (distance / connectionDistance);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(33, 150, 243, ${opacity * 0.2})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 添加鼠标交互效果
    canvas.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      particles.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          particle.speedX += dx * 0.001;
          particle.speedY += dy * 0.001;
        }
      });
    });
    
    connectParticles();
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    animationFrame = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    window.removeEventListener('resize', resizeCanvas);
    cancelAnimationFrame(animationFrame);
  };
};

onMounted(() => {
  const cleanup = initParticles();
  onUnmounted(cleanup);
});
</script>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #000814 100%);
  z-index: 0;
  overflow: hidden;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 修改网格样式，使其更柔和 */
.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at center, rgba(33, 150, 243, 0.05) 1px, transparent 1px),
    linear-gradient(to right, rgba(33, 150, 243, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(33, 150, 243, 0.03) 1px, transparent 1px);
  background-size: 50px 50px, 50px 50px, 50px 50px;
  opacity: 0.7;
  mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 100%);
}

.glow-effects {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.glow-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(33, 150, 243, 0.15) 0%, transparent 70%);
  animation: float 20s infinite linear;
  filter: blur(20px);
}

.glow-circle:nth-child(1) {
  width: 800px;
  height: 800px;
  top: -300px;
  left: -200px;
  animation-delay: 0s;
}

.glow-circle:nth-child(2) {
  width: 600px;
  height: 600px;
  bottom: -200px;
  right: -100px;
  animation-delay: -5s;
}

.glow-circle:nth-child(3) {
  width: 700px;
  height: 700px;
  top: 40%;
  left: 40%;
  animation-delay: -10s;
}

/* 科技元素 */
.tech-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* 数据流效果 */
.data-flow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(90deg, transparent 0%, transparent 45%, rgba(33, 150, 243, 0.2) 50%, transparent 55%, transparent 100%);
  background-size: 200% 100%;
  animation: dataFlow 8s infinite linear;
  filter: blur(3px);
}

/* 波浪效果 */
.wave-effect {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(0deg, rgba(33, 150, 243, 0.05) 0%, transparent 10%),
    linear-gradient(0deg, rgba(33, 150, 243, 0.03) 5%, transparent 15%),
    linear-gradient(0deg, rgba(33, 150, 243, 0.02) 10%, transparent 20%);
  transform-origin: bottom center;
  animation: waveMove 15s ease-in-out infinite alternate;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(30px, 20px) rotate(180deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

@keyframes dataFlow {
  0% { background-position: 200% 0; }
  100% { background-position: 0 0; }
}

@keyframes waveMove {
  0% { transform: scaleY(0.8) translateY(5px); }
  50% { transform: scaleY(1) translateY(0); }
  100% { transform: scaleY(1.2) translateY(-5px); }
}
</style>