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
  padding: 28px;
  background: #f6f7f8;
  /* 不用花背景，真实 UI */
}

.wrapper {
  background: #ffffff;
  border-radius: 14px;
  padding: 40px 48px;
  width: 100%;
  max-width: 640px;

  border: 1px solid #ebecf0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.04);

  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 标题极简风 */
header {
  font-size: 28px;
  font-weight: 600;
  color: #111;
  text-align: left;
  margin-bottom: 32px;
}

/* 去掉彩条、渐变、发光 → 更高级更真实 */
header::after {
  display: none;
}

/* GitHub 链接干净简约 */
.github-link {
  position: absolute;
  top: 20px;
  right: 20px;

  padding: 6px 14px;
  border-radius: 8px;

  background: #fafbfc;
  border: 1px solid #e2e4e8;
  color: #444;

  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;

  transition: background 0.2s ease, border-color 0.2s ease;
}

.github-link:hover {
  background: #f0f1f3;
  border-color: #d0d1d5;
}

.github-link :deep(svg) {
  width: 15px;
  height: 15px;
  opacity: 0.7;
}

/* 移动端 */
@media (max-width: 540px) {
  .wrapper {
    padding: 28px 20px;
  }

  header {
    font-size: 24px;
  }
}
</style>
