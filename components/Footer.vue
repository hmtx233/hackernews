<template>
  <div class="font-serif">
    <UDivider type="dashed" label="hackernews.site" :ui="{ label: 'text-primary-500 dark:text-primary-400' }" />
    <footer class="p-4 text-center">
      <div class="flex flex-col md:flex-row justify-center  items-center">
        <div class="mb-2 md:mb-0">
          <span class="text-sm/6 text-gray-700">&copy;2024-{{ new Date().getFullYear() }}
            <a href="https://github.com/hmtx233"
              class="text-sm/6 text-gray-700 hover:underline transition-all duration-300">hmtx233</a>
          </span>
        </div>
      </div>
    </footer>
  </div>
</template>
