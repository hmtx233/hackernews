<script setup lang="ts">
const {locale} = useI18n()
const lang = locale.value;

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
});

const {data} = toRefs(props);

// deepseek model 翻译
const dsTranslateTxt = async (txt: string, index: any) => {
  if (data?.value != undefined) {
    if (!data.value[index].translated) {
      const params = {
        text: txt,
      };
      const res: any = await $fetch("/api/deepseek-translate", {
        method: "POST",
        body: params
      });
      data.value[index].translated = !data.value[index].translated;
      data.value[index].titleZh = res;
    } else {
      data.value[index].translated = false;
    }
  }
}


const isOpenReview = ref(false);
const reviewData: Ref<any[]> = ref([]);
const page = ref(1);

// 展开评论
const openReview = async (kids: any, parentBy: string, parentNo: string) => {
  if (!isOpenReview.value) {
    const res = await $fetch("/api/hacker-news-review", {
      method: "POST",
      body: {kids: kids, parentBy: parentBy, lang: locale.value, page: page.value, parentNo: parentNo}
    });
    isOpenReview.value = true;
    reviewData.value = reviewData.value.concat(res);
  } else {
    isOpenReview.value = false;
    reviewData.value = [];
    page.value = 1;
  }
}

const moreReview = async (kids: any, parentBy: string, parentNo: string) => {
  const res = await $fetch("/api/hacker-news-review", {
    method: "POST",
    body: {kids: kids, parentBy: parentBy, lang: locale.value, page: page.value, parentNo: parentNo}
  });
  isOpenReview.value = true;
  reviewData.value = reviewData.value.concat(res);
}
</script>

<template>
  <div v-for="(i, index) in [...data].filter(item => item.deleted != true)" class="mt-3 w-full">
    <div class="py-2 pr-2 rounded-md dark:bg-gray-800 bg-gray-200">
      <div class="px-2 pb-1">
        <NuxtLink class="text-xs underline dark:hover:text-primary hover:text-primary" :to="`/${lang}/user?id=${i.by}`">
          {{ '@' + i.by + ' ' }}
        </NuxtLink>
        <span class="text-xs text-primary ">
          {{ $t('reply') }}
        </span>
        <NuxtLink class="text-xs underline dark:hover:text-primary hover:text-primary" :to="`/${lang}/user?id=${i.parentBy}`">
          {{ ' @' + i.parentBy }}
        </NuxtLink>
        <span class="ml-2 text-xs">
          {{ i.time }}
        </span>
      </div>
      <span class="pl-2 text-primary text-md">{{ (i.indexNo) }}</span>
      <div class="pl-2  dark:text-gray-400 text font-serif" v-if="i.translated" v-html="i.titleZh">
      </div>
      <div class="pl-2  dark:text-gray-400 text font-serif" v-else v-html="i.text"></div>
      <div class="flex mt-2 ml-2">
        <div class="flex gap-1">
          <div class="flex" v-if="i.kids != null" @click="() => openReview(i.kids, i.by, i.indexNo)">
            <ULink class="text-xs dark:hover:text-primary hover:text-primary">
              {{ i.kids.length + ' ' + $t('comments') }}
              <span v-if="isOpenReview && i.id == reviewData[0].parent">
                {{ '[-]' }}
              </span>
              <span v-else>
                {{ '[+]' }}
              </span>
            </ULink>
          </div>
          <div class="flex gap-1">
            <UIcon @click="() => dsTranslateTxt(i.text, index)" name="i-heroicons-language"
                   class="mt-0.5  cursor-pointer dark:hover:text-primary hover:text-primary"/>
          </div>
        </div>
      </div>
    </div>
    <ListHnReview v-if="isOpenReview && i.id == reviewData[0].parent" :data="reviewData"/>
    <UButton
        v-if="i.kids != null && isOpenReview && i.id == reviewData['0'].parent && i.kids.length != reviewData.length"
        @click="() => { page++, moreReview(i.kids, i.by, i.indexNo) }" class="flex mt-2 h-6 " size="2xs">
      {{ $t('loadMore') }}
    </UButton>
  </div>
</template>


<style lang="postcss">
.text {
  overflow-wrap: break-word;

  & a:hover {
    color: #f97316;
  }

  & pre {
    white-space: pre-wrap;
  }
}
</style>
