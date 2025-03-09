 <template>
  <div class="pdf-viewer-container">
    <div class="pdf-viewer-header">
      <h3>{{ documentName }}</h3>
      <div class="header-actions">
        <button class="action-btn sign-btn" @click="showSignaturePanel" v-if="!showSignature">
          <span class="btn-icon sign-icon"></span>
          <span class="btn-text">添加签名</span>
        </button>
        <button class="action-btn save-btn" @click="saveSignedPdf" v-if="signatureAdded">
          <span class="btn-icon save-icon"></span>
          <span class="btn-text">保存签名文档</span>
        </button>
        <button class="action-btn close-btn" @click="closeViewer">
          <span class="btn-icon close-icon"></span>
          <span class="btn-text">关闭</span>
        </button>
      </div>
    </div>
    
    <div class="pdf-viewer-content">
      <!-- PDF 预览区域 -->
      <div class="pdf-container" ref="pdfContainer">
        <div v-if="loading" class="pdf-loading">
          <div class="loading-spinner"></div>
          <p>正在加载文档...</p>
        </div>
        <canvas ref="pdfCanvas" class="pdf-canvas"></canvas>
        
        <!-- 签名预览 -->
        <div 
          v-if="signatureAdded" 
          class="signature-preview"
          :style="signatureStyle"
          @mousedown="startDragSignature"
          @touchstart="startDragSignature"
        >
          <img :src="signatureData" alt="签名" class="signature-image" />
          <div class="signature-controls" v-if="showSignatureControls">
            <button class="signature-btn remove-btn" @click="removeSignature">
              <span class="btn-icon remove-icon"></span>
            </button>
            <button class="signature-btn resize-btn" @mousedown="startResizeSignature" @touchstart="startResizeSignature">
              <span class="btn-icon resize-icon"></span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 签名面板 -->
      <div class="signature-panel" v-if="showSignature">
        <div class="panel-header">
          <h4>请在下方区域签名</h4>
          <button class="close-panel-btn" @click="hideSignaturePanel">&times;</button>
        </div>
        <SignatureCanvas 
          ref="signatureCanvas"
          :width="400"
          :height="200"
          @signature-confirmed="addSignatureToPdf"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SignatureCanvas from './SignatureCanvas.vue';

export default {
  name: 'PdfViewer',
  components: {
    SignatureCanvas
  },
  props: {
    documentUrl: {
      type: String,
      required: true
    },
    documentName: {
      type: String,
      default: '文档预览'
    }
  },
  data() {
    return {
      loading: true,
      pdfDoc: null,
      currentPage: 1,
      scale: 1.5,
      showSignature: false,
      signatureData: null,
      signatureAdded: false,
      signaturePosition: { x: 0, y: 0 },
      signatureSize: { width: 150, height: 75 },
      isDraggingSignature: false,
      isResizingSignature: false,
      dragOffset: { x: 0, y: 0 },
      showSignatureControls: false,
      pdfCanvas: null,
      pdfContext: null
    };
  },
  computed: {
    signatureStyle() {
      return {
        left: `${this.signaturePosition.x}px`,
        top: `${this.signaturePosition.y}px`,
        width: `${this.signatureSize.width}px`,
        height: `${this.signatureSize.height}px`
      };
    }
  },
  mounted() {
    this.loadPdf();
    
    // 添加事件监听器
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleTouchEnd);
  },
  beforeUnmount() {
    // 移除事件监听器
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
  },
  methods: {
    async loadPdf() {
      try {
        this.loading = true;
        
        // 在实际应用中，这里应该使用PDF.js加载PDF文档
        // 由于我们没有实际的PDF.js库，这里模拟加载过程
        
        // 模拟加载延迟
        setTimeout(() => {
          this.renderPdfPlaceholder();
          this.loading = false;
          
          // 设置默认签名位置在右下角
          this.$nextTick(() => {
            const container = this.$refs.pdfContainer;
            if (container) {
              this.signaturePosition = {
                x: container.clientWidth - this.signatureSize.width - 20,
                y: container.clientHeight - this.signatureSize.height - 20
              };
            }
          });
        }, 1000);
      } catch (error) {
        console.error('加载PDF文档时出错:', error);
        this.loading = false;
      }
    },
    
    renderPdfPlaceholder() {
      // 创建一个简单的PDF页面占位符
      const canvas = this.$refs.pdfCanvas;
      const context = canvas.getContext('2d');
      
      this.pdfCanvas = canvas;
      this.pdfContext = context;
      
      // 设置画布尺寸为A4纸大小
      const width = 595 * this.scale; // A4宽度，72dpi
      const height = 842 * this.scale; // A4高度，72dpi
      
      canvas.width = width;
      canvas.height = height;
      
      // 绘制白色背景
      context.fillStyle = 'white';
      context.fillRect(0, 0, width, height);
      
      // 绘制边框
      context.strokeStyle = '#ddd';
      context.lineWidth = 1;
      context.strokeRect(0, 0, width, height);
      
      // 绘制文档名称
      context.fillStyle = '#333';
      context.font = '24px Arial';
      context.textAlign = 'center';
      context.fillText(this.documentName, width / 2, 100);
      
      // 绘制PDF图标
      context.fillStyle = '#e74c3c';
      context.font = '48px Arial';
      context.fillText('PDF', width / 2, height / 2);
      
      // 绘制说明文字
      context.font = '16px Arial';
      context.fillStyle = '#666';
      context.fillText('(PDF预览占位符 - 实际应用中将显示真实PDF内容)', width / 2, height / 2 + 50);
    },
    
    showSignaturePanel() {
      this.showSignature = true;
    },
    
    hideSignaturePanel() {
      this.showSignature = false;
    },
    
    addSignatureToPdf(signatureData) {
      this.signatureData = signatureData;
      this.signatureAdded = true;
      this.showSignature = false;
      this.showSignatureControls = true;
      
      // 设置签名位置在右下角
      const container = this.$refs.pdfContainer;
      if (container) {
        this.signaturePosition = {
          x: container.clientWidth - this.signatureSize.width - 20,
          y: container.clientHeight - this.signatureSize.height - 20
        };
      }
    },
    
    startDragSignature(event) {
      event.preventDefault();
      this.isDraggingSignature = true;
      
      const clientX = event.clientX || (event.touches && event.touches[0].clientX);
      const clientY = event.clientY || (event.touches && event.touches[0].clientY);
      
      // 计算鼠标点击位置与签名左上角的偏移
      this.dragOffset = {
        x: clientX - this.signaturePosition.x,
        y: clientY - this.signaturePosition.y
      };
    },
    
    startResizeSignature(event) {
      event.preventDefault();
      event.stopPropagation();
      this.isResizingSignature = true;
    },
    
    handleMouseMove(event) {
      if (this.isDraggingSignature) {
        // 更新签名位置
        this.signaturePosition = {
          x: event.clientX - this.dragOffset.x,
          y: event.clientY - this.dragOffset.y
        };
      } else if (this.isResizingSignature) {
        // 更新签名大小
        const newWidth = event.clientX - this.signaturePosition.x;
        const aspectRatio = this.signatureSize.height / this.signatureSize.width;
        
        this.signatureSize = {
          width: Math.max(50, newWidth),
          height: Math.max(25, newWidth * aspectRatio)
        };
      }
    },
    
    handleTouchMove(event) {
      if (this.isDraggingSignature || this.isResizingSignature) {
        const touch = event.touches[0];
        
        if (this.isDraggingSignature) {
          // 更新签名位置
          this.signaturePosition = {
            x: touch.clientX - this.dragOffset.x,
            y: touch.clientY - this.dragOffset.y
          };
        } else if (this.isResizingSignature) {
          // 更新签名大小
          const newWidth = touch.clientX - this.signaturePosition.x;
          const aspectRatio = this.signatureSize.height / this.signatureSize.width;
          
          this.signatureSize = {
            width: Math.max(50, newWidth),
            height: Math.max(25, newWidth * aspectRatio)
          };
        }
      }
    },
    
    handleMouseUp() {
      this.isDraggingSignature = false;
      this.isResizingSignature = false;
    },
    
    handleTouchEnd() {
      this.isDraggingSignature = false;
      this.isResizingSignature = false;
    },
    
    removeSignature() {
      this.signatureAdded = false;
      this.signatureData = null;
    },
    
    saveSignedPdf() {
      // 在实际应用中，这里应该使用PDF库将签名合并到PDF文档中
      // 这里我们使用Canvas模拟这个过程
      
      try {
        // 创建一个新的Canvas来合成签名和PDF
        const compositeCanvas = document.createElement('canvas');
        const compositeContext = compositeCanvas.getContext('2d');
        
        // 设置Canvas大小与PDF页面相同
        compositeCanvas.width = this.pdfCanvas.width;
        compositeCanvas.height = this.pdfCanvas.height;
        
        // 首先绘制PDF页面
        compositeContext.drawImage(this.pdfCanvas, 0, 0);
        
        // 创建签名图像对象
        const signatureImg = new Image();
        signatureImg.onload = () => {
          // 计算签名在Canvas中的位置
          const canvasRect = this.pdfCanvas.getBoundingClientRect();
          const containerRect = this.$refs.pdfContainer.getBoundingClientRect();
          
          const scaleX = this.pdfCanvas.width / canvasRect.width;
          const scaleY = this.pdfCanvas.height / canvasRect.height;
          
          const signatureX = (this.signaturePosition.x - containerRect.left + canvasRect.left) * scaleX;
          const signatureY = (this.signaturePosition.y - containerRect.top + canvasRect.top) * scaleY;
          const signatureWidth = this.signatureSize.width * scaleX;
          const signatureHeight = this.signatureSize.height * scaleY;
          
          // 绘制签名
          compositeContext.drawImage(signatureImg, signatureX, signatureY, signatureWidth, signatureHeight);
          
          // 将合成后的Canvas转换为图像数据
          const signedPdfData = compositeCanvas.toDataURL('image/png');
          
          // 创建下载链接
          const downloadLink = document.createElement('a');
          downloadLink.href = signedPdfData;
          downloadLink.download = `signed_${this.documentName.replace(/\s+/g, '_')}.png`;
          
          // 触发下载
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          // 通知父组件签名已完成
          this.$emit('document-signed', {
            documentName: this.documentName,
            signedDocumentUrl: signedPdfData
          });
        };
        
        signatureImg.src = this.signatureData;
      } catch (error) {
        console.error('保存签名文档时出错:', error);
        alert('保存签名文档时出错，请重试');
      }
    },
    
    closeViewer() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.pdf-viewer-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: rgba(30, 40, 60, 0.95);
  border-radius: 15px;
  overflow: hidden;
}

.pdf-viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.pdf-viewer-header h3 {
  margin: 0;
  color: #4FC3F7;
  font-size: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.pdf-viewer-content {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pdf-container {
  flex: 1;
  padding: 20px;
  overflow: auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: rgba(0, 0, 0, 0.2);
}

.pdf-canvas {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  background: white;
}

.pdf-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(79, 195, 247, 0.3);
  border-top: 4px solid #4FC3F7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.signature-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(20, 30, 48, 0.95);
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.3);
  z-index: 10;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.panel-header h4 {
  margin: 0;
  color: #4FC3F7;
  font-size: 1.2rem;
}

.close-panel-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: background 0.3s;
}

.close-panel-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.signature-preview {
  position: absolute;
  cursor: move;
  z-index: 5;
  border: 2px dashed transparent;
  transition: border-color 0.3s;
}

.signature-preview:hover {
  border-color: rgba(79, 195, 247, 0.5);
}

.signature-preview:hover .signature-controls {
  opacity: 1;
}

.signature-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.signature-controls {
  position: absolute;
  top: -30px;
  right: 0;
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.3s;
}

.signature-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.7);
}

.remove-btn {
  color: #ff4b4b;
}

.resize-btn {
  color: #4FC3F7;
  cursor: nwse-resize;
}

.btn-icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.action-btn {
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

.sign-btn {
  background: linear-gradient(135deg, #0072ff, #00c6ff);
  box-shadow: 0 0 8px rgba(0, 162, 255, 0.3);
}

.save-btn {
  background: linear-gradient(135deg, #00b09b, #96c93d);
  box-shadow: 0 0 8px rgba(0, 176, 155, 0.3);
}

.close-btn {
  background: linear-gradient(135deg, #757F9A, #D7DDE8);
  box-shadow: 0 0 8px rgba(117, 127, 154, 0.3);
}

.action-btn:hover {
  transform: translateY(-2px);
}

.sign-btn:hover {
  box-shadow: 0 0 10px rgba(0, 162, 255, 0.5);
}

.save-btn:hover {
  box-shadow: 0 0 10px rgba(0, 176, 155, 0.5);
}

.close-btn:hover {
  box-shadow: 0 0 10px rgba(117, 127, 154, 0.5);
}

.sign-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M21.04 12.13c-.14 0-.28.06-.38.17l-1 1 2.05 2.05 1-1c.21-.21.21-.56 0-.77l-1.28-1.28a.533.533 0 0 0-.39-.17zm-1.97 1.75L13 19.94V22h2.06l6.06-6.07-2.05-2.05zM17.85 14.5l-1.67-1.67-1.41 1.41 1.67 1.67 1.41-1.41zM11 18H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v8.17l-2 2V4H4v12h7v2z"/></svg>');
}

.save-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>');
}

.close-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>');
}

.remove-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>');
  width: 14px;
  height: 14px;
  margin: 0;
}

.resize-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 19H15V15H19V19ZM19 14H14V19H19V14ZM13 14H9V19H13V14ZM14 13H19V9H14V13ZM8 14H4V19H8V14ZM9 13H13V9H9V13ZM4 13H8V9H4V13ZM9 8H13V4H9V8ZM14 8H19V4H14V8ZM4 8H8V4H4V8Z"/></svg>');
  width: 14px;
  height: 14px;
  margin: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .pdf-viewer-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .action-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .signature-panel {
    padding: 15px;
  }
}
</style>