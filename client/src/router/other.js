export default function routes (store) {
  return [
    {
      path: 'pages',
      component: () => import('pages/pages/pages.vue')
    },
    {
      path: '/search/:pageId/contributors',
      component: () => import('pages/pages/contributors.vue')
    },
    {
      path: '/pages/:pageId/contributors',
      component: () => import('pages/pages/contributors.vue')
    },
    {
      path: '/pages/:pageId',
      component: () => import('pages/pages/pageId.vue')
    },
    {
      path: '/search/:pageId',
      component: () => import('pages/pages/pageId.vue')
    },
    { path: '/search', component: () => import('pages/pages/search.vue') },
    { path: '/notifications', component: () => import('pages/notifications.vue') },
    { path: '/settings', component: () => import('pages/settings.vue') },
    { path: '/news', component: () => import('pages/news.vue') }
  ]
}
