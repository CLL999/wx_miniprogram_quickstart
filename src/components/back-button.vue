<template>
  <image
    class="flex p-12 w-16 h-16"
    :src="BackPNG"
    @click="disabled ? $emit('disabled-click') : onClick()"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)

defineEmits<{
  (e: 'disabled-click'): void
}>()

const onClick = () => {
  if (getCurrentPages().length > 1) {
    uni.navigateBack({})
  } else {
    uni.redirectTo({ url: '/pages/index/index' })
  }
}
</script>
