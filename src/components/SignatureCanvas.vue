<template>
  <div class="signature-canvas-container">
    <div class="canvas-wrapper">
      <canvas 
        ref="signatureCanvas" 
        class="signature-canvas"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="stopDrawing"
      ></canvas>
    </div>
    <div class="canvas-controls">
      <button class="control-btn clear-btn" @click="clearCanvas">
        <span class="btn-icon clear-icon"></span>
        <span class="btn-text">清除</span>
      </button>
      <button class="control-btn confirm-btn" @click="confirmSignature">
        <span class="btn-icon confirm-icon"></span>
        <span class="btn-text">确认</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignatureCanvas',
  props: {
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 200
    },
    lineWidth: {
      type: Number,
      default: 3
    },
    lineColor: {
      type: String,
      default: '#000000'
    },
    backgroundColor: {
      type: String,
      default: 'rgba(255, 255, 255, 0.9)'
    }
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      isDrawing: false,
      lastX: 0,
      lastY: 0
    };
  },
  mounted() {
    this.initCanvas();
    window.addEventListener('resize', this.resizeCanvas);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeCanvas);
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.signatureCanvas;
      this.ctx = this.canvas.getContext('2d');
      
      // 设置画布大小
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      
      // 设置画布背景
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // 设置线条样式
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.strokeStyle = this.lineColor;
    },
    
    resizeCanvas() {
      // 保存当前画布内容
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = this.canvas.width;
      tempCanvas.height = this.canvas.height;
      tempCtx.drawImage(this.canvas, 0, 0);
      
      // 重新初始化画布
      this.initCanvas();
      
      // 恢复之前的内容
      this.ctx.drawImage(tempCanvas, 0, 0);
    },
    
    startDrawing(event) {
      this.isDrawing = true;
      const { offsetX, offsetY } = this.getCoordinates(event);
      this.lastX = offsetX;
      this.lastY = offsetY;
    },
    
    draw(event) {
      if (!this.isDrawing) return;
      
      const { offsetX, offsetY } = this.getCoordinates(event);
      
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(offsetX, offsetY);
      this.ctx.stroke();
      
      this.lastX = offsetX;
      this.lastY = offsetY;
    },
    
    stopDrawing() {
      this.isDrawing = false;
    },
    
    handleTouchStart(event) {
      event.preventDefault();
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        const { offsetX, offsetY } = this.getTouchCoordinates(touch);
        this.lastX = offsetX;
        this.lastY = offsetY;
        this.isDrawing = true;
      }
    },
    
    handleTouchMove(event) {
      event.preventDefault();
      if (!this.isDrawing || event.touches.length !== 1) return;
      
      const touch = event.touches[0];
      const { offsetX, offsetY } = this.getTouchCoordinates(touch);
      
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(offsetX, offsetY);
      this.ctx.stroke();
      
      this.lastX = offsetX;
      this.lastY = offsetY;
    },
    
    getCoordinates(event) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top
      };
    },
    
    getTouchCoordinates(touch) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
      };
    },
    
    clearCanvas() {
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    
    confirmSignature() {
      // 获取签名图像数据
      const signatureData = this.canvas.toDataURL('image/png');
      
      // 触发事件，将签名数据传递给父组件
      this.$emit('signature-confirmed', signatureData);
    },
    
    // 提供给外部调用的方法，获取当前签名的图像数据
    getSignatureData() {
      return this.canvas.toDataURL('image/png');
    }
  }
};
</script>

<style scoped>
.signature-canvas-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.canvas-wrapper {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
  background: rgba(255, 255, 255, 0.9);
}

.signature-canvas {
  display: block;
  touch-action: none; /* 防止触摸设备上的滚动和缩放 */
  cursor: crosshair;
}

.canvas-controls {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.control-btn {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  color: white;
}

.clear-btn {
  background: linear-gradient(135deg, #757F9A, #D7DDE8);
  box-shadow: 0 0 8px rgba(117, 127, 154, 0.3);
}

.confirm-btn {
  background: linear-gradient(135deg, #0072ff, #00c6ff);
  box-shadow: 0 0 8px rgba(0, 162, 255, 0.3);
}

.control-btn:hover {
  transform: translateY(-2px);
}

.clear-btn:hover {
  box-shadow: 0 0 10px rgba(117, 127, 154, 0.5);
}

.confirm-btn:hover {
  box-shadow: 0 0 10px rgba(0, 162, 255, 0.5);
}

.btn-icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.clear-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>');
}

.confirm-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>');
}
</style> 