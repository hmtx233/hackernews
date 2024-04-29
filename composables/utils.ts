/***
 * 时间戳 转成 yyyy-mm-dd hh:mm:ss
 */
export function timestampToDateTime(timestamp: number) {
  const date = new Date(timestamp * 1000); // 将时间戳转换为毫秒
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
};

/***
 * 将滚动条 移动到顶部
 */
export function scrollToTop() {
  if (process.client) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};


/***
 * 时间戳 转成 x分钟前 x小时前 x天前
 */
export function timestampToChineseTime(time: number) {
  const nowTime = Date.now();
  const time1 = nowTime - time;
  const m = Math.floor(time1 / (1000 * 60));
  const h = Math.floor(time1 / (1000 * 60 * 60));
  const d = Math.floor(time1 / (1000 * 60 * 60 * 24));

  if (m < 60) {
    return `${m} 分钟前`;
  } else if (h < 24) {
    return `${h} 小时前`;
  } else {
    return `${d} 天前`;
  }
}

/***
 * 时间戳 转成 x分钟前 x小时前 x天前
 */
export function timestampToEnglishTime(time: number) {
  const nowTime = Date.now();
  const time1 = nowTime - time;
  const m = Math.floor(time1 / (1000 * 60));
  const h = Math.floor(time1 / (1000 * 60 * 60));
  const d = Math.floor(time1 / (1000 * 60 * 60 * 24));

  if (m < 60) {
    return `${m} minutes ago`;
  } else if (h < 24) {
    return `${h} hours ago`;
  } else {
    return `${d} day ago`;
  }
}
