<template>
  <scroll-view
    id="scroll-view"
    :class="['w-screen h-[99.9vh] bg-gray-f6', customClass]"
    scroll-y
    scroll-with-animation
    enhanced
    enable-back-to-top
    :refresher-enabled="refresherEnabled"
    refresher-default-style="none"
    refresher-background="transparent"
    :refresher-triggered="refresherTriggered"
    @refresherrefresh="onRefresherRefresh"
    @scrolltolower="onScrollToLower"
  >
    <view class="box-border flex flex-col min-h-screen">
      <!-- refresher -->
      <view
        class="flex flex-col justify-end items-center w-full"
        :style="{ height: `${safeTop}px` }"
      >
        <image
          v-if="refresherEnabled"
          class="w-40 h-40 animate-spin"
          :src="ReloadSVG"
          mode="aspectFit"
        />
      </view>

      <!-- 页面内容 -->
      <slot />

      <!-- 底部安全区 -->
      <view :style="{ height: `${safeBottom}px` }" />
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ReloadSVG } from '@/assets/images'

/**
 * 增强 ScrollView 实例，可通过 wx.createSelectorQuery 的 NodesRef.node 方法获取。
 * 仅在 scroll-view 组件开启 enhanced 属性后生效。
 */
export interface ScrollViewContext {
  /** 滚动至指定元素 */
  scrollIntoView(selector: string): void
  /** 滚动至指定位置 */
  scrollTo(args: {
    /** 顶部距离 */
    top?: number
    /** 左边界距离 */
    left?: number
    /** 初始速度 */
    velocity?: number
    /** 滚动动画时长 */
    duration?: number
    /** 是否启用滚动动画 */
    animated?: boolean
  }): void
}

withDefaults(
  defineProps<{
    safeTop: number
    safeBottom: number
    refresherEnabled?: boolean
    customClass?: string
  }>(),
  {
    refresherEnabled: false,
  },
)

const instance = getCurrentInstance()
let scrollViewContext = $ref<ScrollViewContext>()

// 使用小程序的生命周期，以保证能成功获取到 ScrollView 的 context
onReady(() => {
  uni
    .createSelectorQuery()
    .in(instance)
    .select('#scroll-view')
    .node(res => {
      if (!res.node) {
        console.error(`无法获取到 ScrollViewContext`)
        return
      }
      scrollViewContext = res.node
    })
    .exec()
})

let refreshHook: (() => void | Promise<void>) | undefined
let scrollToLowerHook: (() => void | Promise<void>) | undefined

// 下拉刷新
let refresherTriggered = $ref(false)
const onRefresherRefresh = async () => {
  refresherTriggered = true
  const wait = new Promise<void>(resolve => setTimeout(resolve, 500))
  await Promise.allSettled([wait, refreshHook?.()])
  refresherTriggered = false
}

// 滚动到底部
const onScrollToLower = async () => {
  await scrollToLowerHook?.()
}

defineExpose({
  onRefresherRefresh: (hook: () => void | Promise<void>) => {
    refreshHook = hook
  },
  onScrollToLower: (hook: () => void | Promise<void>) => {
    scrollToLowerHook = hook
  },
  scrollToTop: () => {
    console.log('滚动到顶部')
    scrollViewContext?.scrollTo({ top: 0, animated: true, duration: 300 })
  },
  triggerRefresh: () => {
    console.log('触发刷新')
    scrollViewContext?.scrollTo({ top: 0, animated: false })
    refresherTriggered = true
  },
  scrollIntoView: (selector: string) => {
    console.log('滚动到指定元素')
    scrollViewContext?.scrollIntoView(selector)
  },
  scrollTo: (args: Parameters<ScrollViewContext['scrollTo']>[0]) => {
    console.log('滚动到指定位置')
    scrollViewContext?.scrollTo(args)
  },
})
</script>
