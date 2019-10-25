import projectRoutes from './project'
import aboutRoutes from './about'
import otherRoutes from './other'

export default function routes (store) {
  const routes = [
    {
      path: '/',
      component: () => import('layouts/Base.vue'),
      children: [
        {
          path: '',
          component: () => import('pages/LandingPage.vue')
        },
        {
          path: '/project',
          component: () => import('layouts/Project.vue'),
          children: projectRoutes(store)
        },
        {
          path: '/about',
          component: () => import('pages/about/index.vue'),
          children: aboutRoutes(store)
        },
        ...otherRoutes(store)
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
