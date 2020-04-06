export default async ({ router, store }) => {
  router.beforeEach(async (to, from, next) => {
    await store.dispatch('app/syncSessionAsync')
    next()
  })
}
