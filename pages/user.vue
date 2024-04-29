<script setup lang="ts">
import { useSiteDesc } from '~/composables/constant';

const description = useSiteDesc();
const { locale } = useI18n()
const route = useRoute()
const page = ref(1);
const parentNo = ref(1);


// 请求
const { data, error, execute, pending, refresh }: any = useAsyncData("HackerUser", () =>
  $fetch("/api/hacker-user", { method: 'post', body: { id: route.query.id, lang: locale.value, page: page.value, parentNo: parentNo.value } })
);

// seo
useSeoMeta({
  keywords: "黑客新闻 黑客站点 hackernews hn hackernews.site",
  title: "hackernews",
  description,
});

</script>

<template>
  <UContainer class="min-h-screen">
    <div class="mt-5 w-auto mb-10">
      <HackerUser :data="data" />
    </div>
  </UContainer>
</template>
