<script setup lang="ts">
const { locale } = useI18n()
const lang = locale.value;

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
});

const { data } = toRefs(props);
console.log(data.value)
</script>

<template>
<div class="dark:bg-black bg-gray-100 p-6">
  <div class="mb-4">
    <div class="font-bold"> {{ $t('id') + ':  ' + data.id }}</div>
    <div>{{ $t('created') + ':  ' + data.created }}</div>
    <div>{{ $t('karma') + ':  ' + data.karma }}</div>
  </div>
  <div class="mb-4">
    <div class="font-bold">{{ $t('about') + ':  ' }}</div>
    <div class="textHtml" v-html="data.about"></div>
  </div>
  <div class="mb-4">
    <div> {{ $t('submitted') + ':  ' + data.submitted.length }}</div>
  </div>
  <NuxtLink class="text-xs underline dark:hover:text-primary hover:text-primary" :to="`/${lang}`" >
    {{ $t('back') }}
  </NuxtLink>
</div>
</template>

<style lang="postcss">
.textHtml {
  overflow-wrap: break-word;

  & a:hover {
    color: #f97316;
  }

  & pre {
    white-space: pre-wrap;
  }
}
</style>
