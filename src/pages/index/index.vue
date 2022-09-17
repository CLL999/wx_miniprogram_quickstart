<template>
  <view class="w-50 h-50 bg-red-200 relative">
    <text class="absolute bottom-0">123</text>
  </view>
</template>

<script setup lang="ts">
let tab = $ref('')
uni.$on('switch-tab', (value: string) => {
  tab = value
})
</script>
