<template>
  <div class="home-container">
    <div class="wrapper">
      <header>短链接服务</header>

      <UrlInput
        v-model="urlInput"
        :icon="linkIcon"
        placeholder="输入需要缩短的链接 (http://、https:// 或 #小程序://)"
        buttonText="生成短链接"
        @submit="generateShortLink"
      />

      <ShortLinkCard
        :shortUrl="currentShortUrl"
        :visible="responseVisible"
        :isError="isError"
      />

      <LoadingSpinner :active="isLoading">正在生成短链接...</LoadingSpinner>

      <ActionButtons
        :shortUrl="currentShortUrl"
        @generate-qrcode="showQRCodeModal"
        @show-stats="showStats"
        @message="showMessage"
      />

      <QRCodeModal
        :visible="qrcodeModalVisible"
        :url="currentShortUrl"
        @close="closeQRCodeModal"
        @error="showMessage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import githubIcon from '@/assets/images/github.svg?raw';
import linkIcon from '@/assets/images/link.svg?raw';
import ActionButtons from '@/components/ActionButtons.vue';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import UrlInput from '@/components/base/UrlInput.vue';
import QRCodeModal from '@/components/QRCodeModal.vue';
import ShortLinkCard from '@/components/ShortLinkCard.vue';
import { addUrl } from '@/services/api.js';
import { showMessage } from '@/utils/message.js';
import { validateUrl } from '@/utils/validator.js';

// 响应式状态
const urlInput = ref('');
const currentShortUrl = ref('');
const isLoading = ref(false);
const responseVisible = ref(false);
const isError = ref(false);
const qrcodeModalVisible = ref(false);

// 生成短链接
async function generateShortLink() {
  const inputUrl = urlInput.value.trim();
  if (!inputUrl) {
    showMessage('请输入链接', 'error');
    return;
  }

  if (!validateUrl(inputUrl)) {
    showMessage(
      '请输入有效的链接，必须以 http://、https:// 或 #小程序:// 开头',
      'error'
    );
    return;
  }

  // 显示加载状态
  isLoading.value = true;
  responseVisible.value = false;

  try {
    // 使用 API 服务模块
    const data = await addUrl(inputUrl);

    // 隐藏加载状态
    isLoading.value = false;

    // 设置当前短链接
    currentShortUrl.value = window.location.origin + data.url;
    showMessage('短链接生成成功', 'success');
    urlInput.value = '';
    responseVisible.value = true;
    isError.value = false;
  } catch (error) {
    isLoading.value = false;
    showMessage(`发生错误: ${error.message || '未知错误'}`, 'error');
    currentShortUrl.value = '';
    responseVisible.value = false;
  }
}

// 显示二维码模态框
function showQRCodeModal() {
  if (!currentShortUrl.value) {
    showMessage('没有可生成二维码的短链接', 'error');
    return;
  }
  qrcodeModalVisible.value = true;
}

// 关闭二维码模态框
function closeQRCodeModal() {
  qrcodeModalVisible.value = false;
}

// 显示统计信息
function showStats() {
  if (!currentShortUrl.value) {
    showMessage('没有可查看统计的短链接', 'error');
    return;
  }
  showMessage('访问统计功能即将上线', 'info');
}
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa, #e9eff5);
  /* 背景加柔和渐变，真实产品常用 */
}

.wrapper {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 40px 48px;
  width: 100%;
  max-width: 680px;
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.06),
    0 12px 32px rgba(0, 0, 0, 0.04);
  /* 比之前更真实，更像 SaaS 产品 */
  position: relative;
  animation: fadeIn 0.4s ease;
  overflow: hidden;
}

/* 顶部彩条淡化细致，不 AI */
.wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 5px;
  width: 100%;
  background: linear-gradient(90deg, #4f6af0, #8f4fe9);
  border-radius: 0 0 6px 6px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

header {
  font-size: 32px;
  font-weight: 700;
  color: #2c2c2c;
  margin-bottom: 28px;
  letter-spacing: 0.2px;
  position: relative;
}

/* 底部装饰线更细腻 */
header::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 52px;
  height: 3px;
  background: linear-gradient(90deg, #4f6af0, #8f4fe9);
  border-radius: 2px;
}

/* GitHub 链接样式更真实 */
.github-link {
  position: absolute;
  top: 18px;
  right: 18px;
  padding: 8px 14px;
  border-radius: 50px;
  color: #4f6af0;
  border: 1px solid #d2d8ff;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff90;
  backdrop-filter: blur(6px);
  transition: all 0.25s ease;
}

.github-link:hover {
  background: #4f6af0;
  border-color: #4f6af0;
  color: white;
  box-shadow: 0 6px 18px rgba(79,106,240,0.25);
  transform: translateY(-1px);
}

.github-link :deep(svg) {
  width: 16px;
  height: 16px;
}

/* 移动端适配 */
@media (max-width: 540px) {
  .wrapper {
    padding: 28px 20px;
    border-radius: 16px;
    max-width: 100%;
  }

  header {
    font-size: 26px;
  }

  .github-link {
    top: 14px;
    right: 14px;
    padding: 6px 10px;
    font-size: 13px;
  }
}
</style>
