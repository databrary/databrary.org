import aboutRoutes from './about'
import settingsRoutes from './settings'

export default function routes (store) {
  const routes = [
    {
      path: '/',
      component: () => import('layouts/Base.vue'),
      children: [
        {
          path: '',
          component: () => import('pages/Landing.vue')
        },
        {
          path: 'project/:id',
          name: 'projectLanding',
          component: () => import('components/project/ProjectViewer.vue'),
          beforeEnter: (to, from, next) => {
            if (store.get('app/isLoggedIn')) next()
            else next('/')
          }
        },
        {
          path: 'pam/:id',
          name: 'pamLanding',
          component: () => import('components/pam/DashboardEmbed.vue'),
          beforeEnter: (to, from, next) => {
            if (store.get('app/isLoggedIn')) next()
            else next('/')
          }
        },
        {
          path: 'settings',
          redirect: '/settings/profile',
          component: () => import('pages/settings/Index.vue'),
          beforeEnter: (to, from, next) => {
            if (store.get('app/isLoggedIn')) next()
            else next('/')
          },
          children: settingsRoutes(store)
        },
        {
          path: 'about',
          component: () => import('pages/about/Index.vue'),
          children: aboutRoutes(store)
        },
        {
          path: 'search',
          component: () => import('pages/Search.vue')
        },
        {
          path: 'news',
          component: () => import('pages/News.vue')
        }
      ]
    }
  ]

  // Always leave this as last one
  if (process.env.MODE !== 'ssr') {
    routes.push({
      path: '*',
      component: () => import('pages/Error404.vue')
    })
  }
  return routes
}
