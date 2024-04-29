const themeKey = 'theme-color';

export default defineAppConfig({
  ui: {
    primary: process.client && localStorage.getItem(themeKey) != undefined ? localStorage.getItem(themeKey) + '' : 'green',
    gray: 'cool',
  },
  themeKey: themeKey,
})
