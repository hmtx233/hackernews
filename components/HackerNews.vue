<script setup lang="ts">
import * as htmlToImage from 'html-to-image';

const {locale} = useI18n()
const lang = locale.value;
// 用于判断请求是否在进行中
const isPending = ref(false);

// 截图过滤掉带有特定class的元素
const filter = (node: HTMLElement) => {
  const exclusionClasses = ['remove-me'];
  return !exclusionClasses.some((classname) => node.classList?.contains(classname));
}

const cardContext = ref();
const isOpen = ref(false);
const modelId = ref('');

const openModel = (id: string) => {
  if (process.client) {
    modelId.value = id;
    const node = document.getElementById('cut-img-' + id);
    cardContext.value = node;
    console.log(node);
    isOpen.value = true;
  }

}
// 截图
const shareImg = () => {
  isOpen.value = false;
  if (process.client) {
    const node = document.getElementById('cut-img');
    if (node != null) {
      htmlToImage.toJpeg(node, {quality: 0.95, filter: filter})
          .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = Date.now() + '.jpeg';
            link.href = dataUrl;
            link.click();
          });
    } else {
      console.log('node is null');
    }
  }
}

const props = defineProps({
  data: Object,
});

// 参数
const {data} = toRefs(props);

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

// 更多评论
const moreReview = async (kids: any, parentBy: string, parentNo: string) => {
  const res = await $fetch("/api/hacker-news-review", {
    method: "POST",
    body: {kids: kids, parentBy: parentBy, lang: locale.value, page: page.value, parentNo: parentNo}
  });
  isOpenReview.value = true;
  reviewData.value = reviewData.value.concat(res);
}
const toast = useToast();
// deepseek model 翻译
const dsTranslateTxt = async (txt: string, index: any) => {
  if (data?.value != undefined) {
    if (!data.value[index].translated) {
      toast.add({
        id: index,
        title: "提示",
        description: `疯狂请求ing`,
        timeout: 10000,
      });
      const params = {
        text: txt,
      };
      try {
        const res = await $fetch("/api/deepseek-translate", {
          method: "POST",
          body: params,
          onResponse({response}) {
            console.log(response)
          },
          onResponseError({response}) {
            console.error(response)
          }
        });
        data.value[index].translated = !data.value[index].translated;
        data.value[index].titleZh = res;
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        toast.clear();
        isPending.value = false; // 请求结束，无论成功或失败
      }
    } else {
      data.value[index].translated = false;
    }
  }
}

// deepseek model 摘要
const dsSummaryUrl = async (txt: string, index: any) => {
  if (data?.value != undefined) {
    if (!data.value[index].summary) {
      const params = {
        text: txt,
      };
      const res: any = await $fetch("/api/deepseek-summary", {
        method: "POST",
        body: params
      });
      data.value[index].summary = res;
    }
  }
}

// 抖动动画
const shakeFlag = ref(false);

onMounted(() => {
  shakeFn();
})

const shakeFn = () => {
  setTimeout(() => {
    shakeFlag.value = true;
  }, 1000)
  shakeFlag.value = false;
}

watch(data, () => {
  shakeFn();
})

</script>
<template>
  <div class="data">
    <div v-for="(i, index) in data" class="my-4 w-full" :id="`cut-img-${i.id}`">
      <div class="p-3 rounded-md dark:bg-black bg-gray-100 items-center">
        <div class="flex-1">
          <div class="m-2 3xs:block md:hidden ">
            <NuxtLink class="underline cursor-pointer" :to="`/${lang}/user?id=${i.by}`">
              {{ '@' + i.by }}
            </NuxtLink>
            <span class="pl-2 ">
              {{ i.time }}
            </span>
            <UButton class="h-6 inline-block float-right  remove-me" :class="{ 'shake-bottom': shakeFlag }"
                     color="primary" size="2xs" @click="openModel(i.id)">{{
                $t('share')
              }}
            </UButton>
          </div>
          <UButton class="h-6 3xs:hidden md:inline-block float-right remove-me " :class="{ 'shake-bottom': shakeFlag }"
                   color="primary" size="2xs" @click="openModel(i.id)">{{
              $t('share')
            }}
          </UButton>
          <!--          标题-->
          <h5 class="pl-2 dark:hover:text-primary hover:text-primary">
            <ULink :to="i.url" target="_blank" v-if="i.translated" class="text-left underline">
              <span class="text-primary text-lg">{{ (i.indexNo) }}</span>
              {{ i.titleZh }}
              <span v-if="i.url">{{ '(' + i.url.split('/')[2] + ')' }}</span>
            </ULink>
            <ULink :to="i.url" target="_blank" v-else class="text-left underline">
              <span class="text-primary text-lg">{{ (i.indexNo) }}</span>
              {{ i.title }}
              <span v-if="i.url">{{ '(' + i.url.split('/')[2] + ')' }}</span>
            </ULink>
          </h5>
          <!--      <h6 class="pl-2">{{ i.summary }}</h6>-->
          <!--          用户 评论 时间-->
          <div class="flex m-2 items-center">
            <div class="flex gap-2">
              <div class="gap-0.5 3xs:hidden md:flex dark:hover:text-primary hover:text-primary">
                <NuxtLink class="underline" :to="`/${lang}/user?id=${i.by}`">
                  {{ '@' + i.by }}
                </NuxtLink>
              </div>

              <div class="flex gap-0.5" v-if="i.kids != null" @click="() => openReview(i.kids, i.by, i.indexNo)">
                <ULink class="underline  dark:hover:text-primary hover:text-primary">
                  {{ i.descendants + ' ' + $t('comments') }}
                  <span v-if="isOpenReview && i.id == reviewData['0'].parent">
                    {{ '[-]' }}
                  </span>
                  <span v-else>
                    {{ '[+]' }}
                  </span>
                </ULink>
              </div>
              <div class="flex remove-me ">
                <UIcon @click="() => dsTranslateTxt(i.title, index)" name="i-heroicons-language"
                       class="mt-0.5  cursor-pointer dark:hover:text-primary hover:text-primary"/>
              </div>

              <div class="flex gap-0.5">
                <span>{{ i.score + ' ' + $t('points') }}</span>
              </div>

              <div class="gap-0.5 3xs:hidden md:flex">
                <span class="">
                  {{ i.time }}
                </span>
              </div>
              <!--  <div class="flex remove-me">-->
              <!--    <UIcon @click="() => dsSummaryUrl(i.url, index)" name="i-heroicons-square-3-stack-3d" class="mt-0.5"/>-->
              <!--  </div>-->
            </div>
          </div>
          <!--          评论-->
          <div class="w-full review">
            <ListHnReview v-if="isOpenReview && i.id == reviewData['0'].parent" :data="reviewData"/>
            <UButton color="primary"
                     v-if="i.kids != null && isOpenReview && i.id == reviewData['0'].parent && i.kids.length != reviewData.length"
                     @click="() => { page++, moreReview(i.kids, i.by, i.indexNo.split('#')[1]) }"
                     class="flex mt-2 h-6  remove-me" :class="{ 'shake-bottom': shakeFlag }" size="xs">
              {{ $t('loadMore') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <UModal v-model="isOpen" :overlay="true" :transition="false">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-800 dark:text-white">
              截图分享
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                     @click="isOpen = false"/>
          </div>
        </template>
        <div class="rounded-lg shadow-sm border border-primary-400  p-2" id="cut-img">
          <h4 class="font-serif dark:text-gray-500  mb-1">hackernews 新闻</h4>
          <div class="font-medium text-sm mb-1" v-html="cardContext.innerHTML">
          </div>
          <div class="text-xs dark:text-gray-500 text-gray-400 mb-1">
            <span class="font-serif text-right">截图来自: https://hackernews.site
              {{ timestampToDateTime(new Date().getTime() / 1000) }}
            </span>
          </div>
        </div>
        <template #footer>
          <div class="flex items-center justify-between">
            <UButton color="gray" variant="ghost" class="-my-1" @click="isOpen = false">取消</UButton>
            <UButton color="gray" variant="ghost" class="-my-1" @click="shareImg">确认</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<style>
.shake-bottom {
  -webkit-animation: shake-bottom 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
  animation: shake-bottom 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
}

@-webkit-keyframes shake-bottom {

  0%,
  100% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transform-origin: 50% 100%;
    transform-origin: 50% 100%
  }

  10% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg)
  }

  20%,
  40%,
  60% {
    -webkit-transform: rotate(-4deg);
    transform: rotate(-4deg)
  }

  30%,
  50%,
  70% {
    -webkit-transform: rotate(4deg);
    transform: rotate(4deg)
  }

  80% {
    -webkit-transform: rotate(-2deg);
    transform: rotate(-2deg)
  }

  90% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg)
  }
}

@keyframes shake-bottom {

  0%,
  100% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transform-origin: 50% 100%;
    transform-origin: 50% 100%
  }

  10% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg)
  }

  20%,
  40%,
  60% {
    -webkit-transform: rotate(-4deg);
    transform: rotate(-4deg)
  }

  30%,
  50%,
  70% {
    -webkit-transform: rotate(4deg);
    transform: rotate(4deg)
  }

  80% {
    -webkit-transform: rotate(-2deg);
    transform: rotate(-2deg)
  }

  90% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg)
  }
}
</style>
