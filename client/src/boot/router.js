export default async ({ router, store }) => {
  router.beforeEach(async (to, from, next) => {
    store.dispatch('app/syncSessionAsync')
    next()
  })
}
