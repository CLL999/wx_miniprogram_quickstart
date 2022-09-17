<template>
  <view
    class="absolute top-0 z-50 w-screen flex flex-col bg-gray-f6/80 backdrop-blur-xl"
    :style="{ paddingTop: `${safeTop}px` }"
  >
    <view class="relative flex flex-col" :style="{ height: `${menuBarHeight}px` }">
      <view class="absolute inset-x-12 inset-y-0 flex flex-row items-center">
        <slot name="leading" />
      </view>
      <view class="relative h-full flex flex-row items-center mx-auto">
        <slot name="content" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const paddings = usePaddingsStore()
const { safeTop, menuBarHeight } = $(storeToRefs(paddings))
</script>
