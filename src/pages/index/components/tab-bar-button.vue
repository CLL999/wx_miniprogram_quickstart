<template>
  <view
    :class="[
      'flex flex-col justify-center items-center w-100 h-56',
      tab === title ? 'text-blue-main' : 'text-gray-60',
    ]"
    @click="onClick"
  >
    <text :class="[iconClass, 'text-24']" />
    <text class="mt-2 text-12 leading-12">
      {{ title }}
    </text>
  </view>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'

const props = defineProps<{
  title: string
  iconClass?: string
}>()

let tab = $(inject<Ref<string>>('tab')!)

const onClick = () => {
  uni.vibrateShort({})
  tab = props.title
}
</script>
