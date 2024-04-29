import { timestampToEnglishTime, timestampToChineseTime } from "~/composables/utils";
import { configureSWRHeaders } from "../utils/swr";

export default eventHandler(async (event) => {
  configureSWRHeaders(event)
  const params = await readBody(event);
  console.log(params);
  // 调用接口
  return await getData(params);
})

const getData = async (params: any) => {
  const pageSize = 10;
  const pageNo = params.page;
  const parentNo = params.parentNo;
  const lang = params.lang;
  const dataList = await Promise.all(params.kids.slice((Number(pageNo) - 1) * pageSize, Number(pageNo) * pageSize).map(async (item: any, indexNo: number) => {
    const itemStory: any = await $fetch('https://hacker-news.firebaseio.com/v0/item/' + item + '.json?print=pretty');
    itemStory.time = (lang === 'en' ? timestampToEnglishTime(itemStory.time * 1000) : timestampToChineseTime(itemStory.time * 1000));
    itemStory.translated = false;
    itemStory.titleZh = '';
    itemStory.parentBy = params.parentBy;
    itemStory.page = params.parentBy;
    itemStory.indexNo = parentNo + '#' + (pageSize * (pageNo - 1) + indexNo + 1);
    return itemStory;
  }));
  return dataList;
}
