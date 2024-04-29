<script setup lang="ts">
const showScrollToTop = ref(false);

const handleScroll = () => {
  showScrollToTop.value = window.scrollY > 100; // 调整200的值以控制按钮显示的阈值
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // 初始时检查是否需要显示按钮
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>



<template>
  <div v-if="showScrollToTop"
    class="bg-gray-100 fixed bottom-20 right-5 bg-primary w-8 h-8 rounded-3xl flex items-center justify-center cursor-pointer transition-opacity"
    @click="scrollToTop">
    <UIcon name="i-heroicons-arrow-long-up" class="dark:bg-black bg-slate-50" />
  </div>
</template>
