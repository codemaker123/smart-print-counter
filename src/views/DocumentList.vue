<template>
  <div class="document-list-container">
    <div class="header">
      <h1>文档列表</h1>
    </div>
    <div class="content">
      <div class="document-box">
        <div class="customer-info" v-if="customer">
          <h2>客户信息</h2>
          <div class="info-row">
            <span class="info-label">姓名：</span>
            <span class="info-value">{{ customer.name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">联系电话：</span>
            <span class="info-value">{{ customer.phone }}</span>
          </div>
          <div class="info-row" v-if="customer.licensePlate">
            <span class="info-label">车牌号码：</span>
            <span class="info-value">{{ customer.licensePlate }}</span>
          </div>
        </div>
        
        <div class="document-list">
          <h2>相关文档</h2>
          <div class="document-table">
            <div class="table-header">
              <div class="col document-name">文档名称</div>
              <div class="col document-date">创建日期</div>
              <div class="col document-size">文件大小</div>
              <div class="col document-actions">操作</div>
            </div>
            <div class="table-body">
              <div v-if="documents.length === 0" class="no-documents">
                <p>暂无相关文档</p>
              </div>
              <div v-else v-for="(doc, index) in documents" :key="index" class="document-row">
                <div class="col document-name">
                  <div class="pdf-icon"></div>
                  {{ doc.name }}
                </div>
                <div class="col document-date">{{ doc.date }}</div>
                <div class="col document-size">{{ doc.size }}</div>
                <div class="col document-actions">
                  <button class="action-btn preview-btn" @click="previewDocument(doc)">
                    <span class="btn-icon preview-icon"></span>
                    <span class="btn-text">预览</span>
                  </button>
                  <button class="action-btn print-btn" @click="printDocument(doc)">
                    <span class="btn-icon print-icon"></span>
                    <span class="btn-text">打印</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="options">
          <button class="option-btn back-btn" @click="goBack">
            <span class="button-text">返回</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- PDF预览弹窗 -->
    <div class="pdf-preview-modal" v-if="showPreview">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ currentDocument ? currentDocument.name : '文档预览' }}</h3>
          <button class="close-btn" @click="closePreview">&times;</button>
        </div>
        <div class="modal-body">
          <div class="pdf-container">
            <!-- 这里可以集成PDF.js或其他PDF预览组件 -->
            <div class="pdf-placeholder">
              <p>PDF预览区域</p>
              <p class="pdf-loading">加载中...</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-btn print-btn" @click="printCurrentDocument">
            <span class="btn-icon print-icon"></span>
            <span class="btn-text">打印</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 添加背景组件 -->
    <Background class="page-background" />
  </div>
</template>

<script>
import Background from '@/components/Background.vue';
export default {
  name: 'DocumentList',
  components: {
    Background
  },
  data() {
    return {
      customer: null,
      documents: [],
      showPreview: false,
      currentDocument: null
    };
  },
  created() {
    // 从路由参数获取客户信息，或者通过API获取
    const customerId = this.$route.query.customerId;
    const licensePlate = this.$route.query.licensePlate;
    const fieldValue = this.$route.query.fieldValue;
    
    if (customerId) {
      this.fetchCustomerData(customerId, licensePlate, fieldValue);
    }
  },
  methods: {
    fetchCustomerData(customerId, licensePlate, fieldValue) {
      // 这里应该是从API获取数据
      // 以下是模拟数据
      this.customer = {
        id: customerId,
        name: '客户' + customerId.substring(customerId.length - 4),
        phone: '138' + Math.floor(Math.random() * 100000000),
        licensePlate: licensePlate || '京A12345',
        fieldValue: fieldValue
      };
      
      // 模拟文档数据
      this.documents = [
        {
          id: '1',
          name: '车辆保险单.pdf',
          date: '2023-03-01',
          size: '2.5MB',
          url: '/documents/insurance.pdf'
        },
        {
          id: '2',
          name: '车辆维修记录.pdf',
          date: '2023-03-05',
          size: '1.8MB',
          url: '/documents/repair.pdf'
        },
        {
          id: '3',
          name: '车辆年检报告.pdf',
          date: '2023-02-15',
          size: '3.2MB',
          url: '/documents/inspection.pdf'
        }
      ];
    },
    previewDocument(doc) {
      this.currentDocument = doc;
      this.showPreview = true;
    },
    closePreview() {
      this.showPreview = false;
      this.currentDocument = null;
    },
    printDocument(doc) {
      console.log('打印文档:', doc.name);
      // 实现打印逻辑
      alert(`正在打印文档: ${doc.name}`);
    },
    printCurrentDocument() {
      if (this.currentDocument) {
        this.printDocument(this.currentDocument);
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');

.document-list-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: white;
  font-family: 'Noto Sans SC', sans-serif;
  position: relative;
  overflow: hidden;
}

.page-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.header {
  padding: 60px 20px 30px;
  text-align: center;
  position: relative;
  z-index: 10;
}

.header h1 {
  margin: 0;
  font-size: 2.8rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-shadow: 
    0 0 10px rgba(0, 162, 255, 0.6),
    0 0 20px rgba(0, 162, 255, 0.3);
  color: #4FC3F7;
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  perspective: 1200px;
}

.document-box {
  width: 1000px;
  max-height: 700px;
  padding: 40px;
  background: rgba(240, 244, 255, 0.1);
  border-radius: 29px;
  box-shadow: 
    0 0 36px rgba(120, 160, 255, 0.2),
    0 0 72px rgba(120, 160, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  background-image: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(255, 255, 255, 0.15) 100%);
  transition: all 0.5s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.document-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.07) 0%,
    rgba(255, 255, 255, 0.03) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  z-index: 1;
  pointer-events: none;
}

.customer-info {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.customer-info h2, .document-list h2 {
  font-size: 1.8rem;
  color: #4FC3F7;
  margin-bottom: 15px;
  text-shadow: 0 0 6px rgba(120, 160, 255, 0.6);
}

.info-row {
  display: flex;
  margin-bottom: 10px;
}

.info-label {
  width: 100px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.info-value {
  flex: 1;
  color: white;
}

.document-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 30px;
}

.document-table {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
}

.table-header {
  display: flex;
  background: rgba(0, 162, 255, 0.3);
  padding: 15px 20px;
  font-weight: 500;
}

.table-body {
  max-height: 300px;
  overflow-y: auto;
}

.document-row {
  display: flex;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background 0.3s;
}

.document-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

.col {
  padding: 0 10px;
}

.document-name {
  flex: 3;
  display: flex;
  align-items: center;
}

.document-date, .document-size {
  flex: 1;
  display: flex;
  align-items: center;
}

.document-actions {
  flex: 2;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.pdf-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff4b4b"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/></svg>');
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

.preview-btn {
  background: linear-gradient(135deg, #0072ff, #00c6ff);
  box-shadow: 0 0 8px rgba(0, 162, 255, 0.3);
}

.print-btn {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  box-shadow: 0 0 8px rgba(255, 65, 108, 0.3);
}

.action-btn:hover {
  transform: translateY(-2px);
}

.preview-btn:hover {
  box-shadow: 0 0 10px rgba(0, 162, 255, 0.5);
}

.print-btn:hover {
  box-shadow: 0 0 10px rgba(255, 65, 108, 0.5);
}

.btn-icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.preview-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>');
}

.print-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>');
}

.no-documents {
  padding: 30px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

.options {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.option-btn {
  padding: 1rem 3rem;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 18px;
  border: none;
  border-radius: 60px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  color: white;
  font-weight: bold;
  min-width: 180px;
}

.back-btn {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  box-shadow: 0 0 8px rgba(58, 123, 213, 0.3);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 10px rgba(58, 123, 213, 0.5);
}

/* PDF预览弹窗样式 */
.pdf-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  width: 80%;
  height: 80%;
  background: rgba(30, 40, 60, 0.95);
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 
    0 0 30px rgba(0, 162, 255, 0.3),
    0 0 60px rgba(0, 162, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  margin: 0;
  color: #4FC3F7;
  font-size: 1.5rem;
}

.close-btn {
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

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.pdf-container {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pdf-placeholder {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

.pdf-loading {
  margin-top: 10px;
  font-size: 14px;
  color: #4FC3F7;
}

.modal-footer {
  padding: 15px 20px;
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .document-box {
    width: 90%;
    padding: 30px;
  }
  
  .document-actions {
    flex-direction: column;
    gap: 5px;
  }
  
  .action-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .table-header, .document-row {
    flex-direction: column;
    padding: 10px;
  }
  
  .col {
    padding: 5px 0;
  }
  
  .document-actions {
    flex-direction: row;
    justify-content: flex-start;
  }
}
</style> 