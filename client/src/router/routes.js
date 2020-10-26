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
        }, // Reda: deactivate project path give access only to children or just change to /project/:id path
        {
          path: '/bookmarks',
          component: () => import('pages/Bookmarks')
        },
        {
          path: '/project',
          component: () => import('layouts/Project.vue'),
          children: projectRoutes(store)
        },
        {
          path: '/pam',
          component: () => import('layouts/Project.vue'),
          children: [{
            name: 'pam',
            path: ':projectId',
            component: () => import('components/project/pam/Dashboard.vue')
          }]
        },
        {
          path: '/settings',
          component: () => import('pages/Settings.vue')
        },
        {
          path: '/about',
          component: () => import('pages/about/Index.vue'),
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
