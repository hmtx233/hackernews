<script setup lang="ts">
import { useHackerNewsLink, useSiteDesc } from '~/composables/constant';
const hackerNewsLinks = useHackerNewsLink();
const description = useSiteDesc();
const { locale } = useI18n()

// 参数
const page = ref(1)
const order = ref('newstories')
const pageCount = ref(500)
const pageMax = ref(6)
const params = ref({ order: order, page: page })

// 请求
const { data, error, execute, pending, refresh }: any = useAsyncData("hackernews", () =>
  $fetch("/api/hacker-news", { method: 'post', body: { order: params.value.order, page: params.value.page, lang: locale.value } })
);

// 监听页面 改变参数
watch(page, () => {
  params.value.page = page.value;
  execute()
  scrollToTop();
});

// seo
useSeoMeta({
  keywords: "黑客新闻 黑客站点 hackernews hn hackernews.site",
  title: "hackernews",
  description,
});

// tab 改变
const onChange = (index: number) => {
  page.value = 1;
  const item = hackerNewsLinks[index]
  params.value.order = `${item.label}stories`
  execute()
}
</script>

<template>
  <UContainer class="min-h-screen">
    <div class="mt-5 w-auto mb-10">
      <UTabs :items="hackerNewsLinks" @change="onChange" :ui="{
        list: {
          tab: {
            padding: 'px-0',
            rounded: 'rounded-sm',
          },
        },
      }
        ">
        <template #default="{ item }">
          {{ $t(item.label) }}
        </template>
      </UTabs>
      <div class="USkeleton" v-if="pending">
        <div class="flex p-4 rounded-sm dark:bg-black bg-gray-50 gap-4 mt-4" v-for="i in 12">
          <div class="flex-auto">
            <USkeleton class="mt-2 w-full h-4 " />
            <div class="flex">
              <div class="flex gap-2 mr-2" v-for="i in 3">
                <USkeleton class="mt-2 w-6 h-6 rounded-full mb-2" />
                <USkeleton class="mt-2 w-10 h-6 mb-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <HackerNews :data="data" />
      <UPagination class="mt-6 w-full" size="md" :max="pageMax" 
        :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: `${$t('prev')}`, class: 'primary bg-gray-100 dark:bg-black' }"
        :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: `${$t('next')}`, class: 'primary bg-gray-100 dark:bg-black' }"
        v-model="page" :total="pageCount" />
    </div>
  </UContainer>
</template>
