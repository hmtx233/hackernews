<template>
  <header
    class="bg-background/75 backdrop-blur border-b -mb-px sticky top-0 z-50 border-gray-200 dark:border-gray-800 mx-auto">
    <div
      class="mx-auto py-2 px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-between gap-3 h-[--header-height]">
      <div class="lg:flex-1 flex items-center gap-1.5">
        <a href="/">
          <span class="font-bold italic text-primary">hackernews.site</span>
        </a>
      </div>
      <div class="flex items-center justify-end lg:flex-1">
        <!-- 黑暗模式 -->
        <Dark />
        <Github />
        <Theme />
        <I18n />
      </div>
    </div>
  </header>
</template>
