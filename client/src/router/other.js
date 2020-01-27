// Reda: these routes are examples
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
    {
      path: '/search',
      name: 'search',
      component: () => import('pages/pages/search.vue')
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('pages/notifications.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('pages/settings.vue')
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('pages/news.vue')
    }
  ]
}
