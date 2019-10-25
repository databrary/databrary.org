export default function routes (store) {
  return [
    {
      path: 'create',
      component: () => import('pages/ProjectCreate.vue')
    },
    {
      name: 'projectLanding',
      path: ':projectId',
      component: () => import('pages/Project/Landing.vue')
    }
  ]
}
