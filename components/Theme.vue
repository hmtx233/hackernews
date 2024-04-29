<template>
    <UDropdown :ui="{ width: 'w-20' }" :items="color" :popper="{ placement: 'bottom-start' }">
      <span class="ml-1 i-heroicons-swatch-20-solid flex-shrink-0 h-5 w-5 primary" aria-hidden="true"></span>
      <template #item="{ item }">
        <div @click="changeTheme(item.label)"
          :class="`w-full bg-${item.label}-400 text-${item.label}-400 dark:bg-${item.label}-400 dark:text-${item.label}-400 rounded-full cursor-pointer`">
          颜色
        </div>
      </template>
    </UDropdown>
</template>

<script lang="ts" setup>
const color = ref([
  [{ label: "red" }],
  [{ label: "green" }],
  [{ label: "yellow" }],
  // [{ label: "pink" }],
  // [{ label: "blue" }],
  // [{ label: "rose" }],
  [{ label: "orange" }],
  // [{ label: "amber" }],
  // [{ label: "lime" }],
  // [{ label: "emerald" }],
  // [{ label: "teal" }],
  // [{ label: "cyan" }],
  [{ label: "sky" }],
  // [{ label: "indigo" }],
  // [{ label: "violet" }],
  // [{ label: "purple" }],
  [{ label: "fuchsia" }],
]);
const appConfig = useAppConfig();

const changeTheme = (item: any) => {
  appConfig.ui.primary = item;
  if (process.client) {
    localStorage.setItem(appConfig.themeKey, item);
  }
};

</script>

<style></style>
