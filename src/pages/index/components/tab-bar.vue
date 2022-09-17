<template>
  <view
    class="absolute bottom-0 inset-x-0 flex flex-row justify-around bg-gray-f6/80 backdrop-blur-xl border-t-1 border-gray-200 border-solid"
    :style="{ paddingBottom: `${safeBottom}px` }"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
const paddings = usePaddingsStore()
const { safeBottom } = $(storeToRefs(paddings))
watchEffect(() => {
  paddings.tabBarHeight = 56 + safeBottom
})

let tab = $ref<string>('')
provide('tab', $$(tab))

const props = defineProps<{
  modelValue: string
}>()
watchEffect(() => {
  tab = props.modelValue
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
watchEffect(() => {
  emits('update:modelValue', tab)
})
</script>
