<script setup>
const { locale, locales, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return locales.value
})

// 创建一个响应式变量来存储下拉菜单的选中值
const selectedLocale = ref(locale.value)

// 处理语言切换的方法
const changeLocale = async () => {
  setLocale(selectedLocale.value)
  switchLocalePath(selectedLocale.value)
}
</script>

<template>
  <div class="ml-2 font-serif">
  <USelectMenu v-model="selectedLocale" :options="availableLocales"
    value-attribute="code" option-attribute="name" @change="changeLocale" />
  </div>
</template>
