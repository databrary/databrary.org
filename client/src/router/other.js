// Reda: these routes are examples
export default function routes (store) {
  return [
    {
      path: 'pages',
      component: () => import('pages/pages/Pages.vue')
    },
    {
      path: '/search/:pageId/contributors',
      component: () => import('pages/pages/Contributors.vue')
    },
    {
      path: '/pages/:pageId/contributors',
      component: () => import('pages/pages/Contributors.vue')
    },
    {
      path: '/pages/:pageId',
      component: () => import('pages/pages/PageId.vue')
    },
    {
      path: '/search/:pageId',
      component: () => import('pages/pages/PageId.vue')
    },
    { path: '/search', component: () => import('pages/Search.vue') },
    { path: '/notifications', component: () => import('pages/Notifications.vue') },
    { path: '/news', component: () => import('pages/News.vue') }
  ]
}
