import { provideApolloClients } from '@vue/apollo-composable'
import { createPinia } from 'pinia'
import { createSSRApp } from 'vue'

import { apolloClient } from '@/utils/apollo'

import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)

  app.use(createPinia())

  provideApolloClients({
    default: apolloClient,
  })

  return { app }
}
