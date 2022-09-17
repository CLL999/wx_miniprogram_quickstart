export const useAuthStore = defineStore('auth', () => {
  let authing = $ref(true)
  let authenticated = $ref(false)

  return $$({
    authing,
    authenticated,
    // viewerInfo,
    // refetch,
  })
})
