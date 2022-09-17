<script setup lang="ts">
import { ApolloClients } from '@vue/apollo-composable'
import PromisePolyfill from 'promise-polyfill'

import { apolloClient } from './utils/apollo'

/**
 * iOS 小程序 Promise 使用的微信内置的 Polyfill，但这个 Polyfill 有 Bug 且功能不全：
 *   - 在某些情况下 Promise 回调不会执行 (直接导致 Vue 状态失效)
 *   - 不支持 Promise.prototype.finally
 * 因此需要覆盖掉这个 Promise。
 *
 * 如果不需要兼容 iOS10 也可以使用以下方式：
 *   Promise = Object.getPrototypeOf((async () => {})()).constructor
 * 不过这种方式有一个问题就是 iOS 12 及以下不支持 Promise.allSettled
 *
 * 因此最好使用 promise-polyfill 库提供的 Polyfill，问题比较少
 */
// eslint-disable-next-line no-global-assign
Promise = PromisePolyfill

provide(ApolloClients, {
  default: apolloClient,
})

onLaunch(() => {
  const updateManager = uni.getUpdateManager()
  updateManager.onUpdateReady(() => {
    uni.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: res => {
        if (res.confirm) {
          updateManager.applyUpdate()
        }
      },
    })
  })
})
</script>

<style lang="css">
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

html {
  width: 100vw;
  height: 100vh;
}

uni-page-body {
  height: 100%;
}

scroll-view {
  width: unset;
}

textarea {
  width: unset;
  height: unset;
}

button {
  display: flex;
  margin: 0;
  padding: 0;
  background-color: unset;
  line-height: unset;
}

button::after {
  border: unset;
}
</style>
