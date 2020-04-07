export default async ({ router, store }) => {
  router.beforeEach(async (to, from, next) => {
    try {
      await store.dispatch('app/syncSessionAsync')
    } catch (error) {
      store.commit('app/isBackendDisconnected', true)
    } finally {
      next()
    }
  })
}
