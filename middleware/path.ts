export default defineNuxtRouteMiddleware((to, from) => {
  const { locale } = useI18n()
  const lang = locale.value;
  if (to.fullPath === "/") {
    return `/${lang}${to.fullPath}`;
  }
  return to.fullPath;
})
