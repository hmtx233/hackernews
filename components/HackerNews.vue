<script setup lang="ts">
import * as htmlToImage from 'html-to-image';
const { locale } = useI18n()
const lang = locale.value;

// 截图过滤掉带有特定class的元素
const filter = (node: HTMLElement) => {
  const exclusionClasses = ['remove-me'];
  return !exclusionClasses.some((classname) => node.classList?.contains(classname));
}

// 截图
const shareImg = (id: any) => {
  if (process.client) {
    const node = document.getElementById('cut-img-' + id);
    if (node != null) {
      htmlToImage.toJpeg(node, { quality: 0.95, filter: filter })
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
const { data } = toRefs(props);

const isOpenReview = ref(false);
const reviewData: Ref<any[]> = ref([]);
const page = ref(1);

// 展开评论
const openReview = async (kids: any, parentBy: string, parentNo: string) => {
  if (!isOpenReview.value) {
    const res = await $fetch("/api/hacker-news-review", {
      method: "POST",
      body: { kids: kids, parentBy: parentBy, lang: locale.value, page: page.value, parentNo: parentNo }
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
    body: { kids: kids, parentBy: parentBy, lang: locale.value, page: page.value, parentNo: parentNo }
  });
  isOpenReview.value = true;
  reviewData.value = reviewData.value.concat(res);
}



// 腾讯 翻译
const txTranslateTxt = async (txt: string, index: any) => {
  if (data?.value != undefined) {
    if (!data.value[index].translated) {
      const params = {
        SourceText: txt,
        Source: "en",
        Target: "zh",
        ProjectId: 0
      };
      const res: any = await $fetch("/api/tx-translate", {
        method: "POST",
        body: params
      });
      data.value[index].translated = !data.value[index].translated;
      data.value[index].titleZh = res.TargetText
    } else {
      data.value[index].translated = false;
    }
  }
}

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
      <div class="p-3 rounded-md dark:bg-black bg-gray-100 my-4 items-center">
        <div class="flex-1">
          <div class="m-2 3xs:block md:hidden ">
            <NuxtLink class=" underline" :to="`/${lang}/user?id=${i.by}`">
              {{ '@' + i.by }}
            </NuxtLink>
            <span class="pl-2 ">
              {{ i.time }}
            </span>
            <UButton class="h-6 inline-block float-right " :class="{ 'shake-bottom': shakeFlag }" color="primary"
              size="2xs" @click="shareImg(i.id)">{{
                $t('share')
              }}</UButton>
          </div>
          <UButton class="h-6 3xs:hidden md:inline-block float-right " :class="{ 'shake-bottom': shakeFlag }"
            color="primary" size="2xs" @click="shareImg(i.id)">{{
              $t('share')
            }}</UButton>
          <h6 class="pl-2 dark:hover:text-primary hover:text-primary">
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
          </h6>
          <div class="flex m-2 items-center">
            <div class="flex gap-2">
              <div class="gap-0.5 3xs:hidden md:flex dark:hover:text-primary hover:text-primary">
                <NuxtLink class="underline" :to="`/${lang}/user?id=${i.by}`">
                  {{ '@' + i.by }}
                </NuxtLink>
              </div>

              <div class="gap-0.5 3xs:hidden md:flex">
                <span class="">
                  {{ i.time }}
                </span>
              </div>

              <div class="flex gap-0.5">
                <ULink class="">{{ i.score + ' ' + $t('points') }}</ULink>
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
              <!-- <div class="flex remove-me">
                <UIcon @click="() => txTranslateTxt(i.title, index)" name="i-heroicons-language" class="mt-0.5" />
              </div> -->
            </div>
          </div>
          <div class="w-full review">
            <ListHnReview v-if="isOpenReview && i.id == reviewData['0'].parent" :data="reviewData" />
            <UButton color="primary"
              v-if="i.kids != null && isOpenReview && i.id == reviewData['0'].parent && i.kids.length != reviewData.length"
              @click="() => { page++, moreReview(i.kids, i.by, i.indexNo.split('#')[1]) }" class="flex mt-2 h-6 "
              :class="{ 'shake-bottom': shakeFlag }" size="xs">
              {{ $t('loadMore') }}</UButton>
          </div>
        </div>
      </div>
    </div>
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
