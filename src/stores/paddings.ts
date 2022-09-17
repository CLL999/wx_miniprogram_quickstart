export const usePaddingsStore = defineStore('paddings', () => {
  const systemInfo = uni.getSystemInfoSync()
  const menuRect = uni.getMenuButtonBoundingClientRect?.() ?? { top: 4, height: 40 }

  const screenWidth = $ref(systemInfo.screenWidth)
  const screenHeight = $ref(systemInfo.screenHeight)
  const safeTop = $ref(systemInfo.statusBarHeight ?? 0)
  const safeBottom = $ref(systemInfo.safeAreaInsets?.bottom ?? 34)
  const menuBarHeight = $computed(() => 2 * (menuRect.top - safeTop) + menuRect.height)
  const headerHeight = $computed(() => safeTop + menuBarHeight)

  const tabBarHeight = $ref(0)
  const weekBarHeight = $ref(0)

  return $$({
    screenWidth,
    screenHeight,
    safeTop,
    safeBottom,
    headerHeight,
    menuBarHeight,
    tabBarHeight,
    weekBarHeight,
  })
})
