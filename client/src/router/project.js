export default function routes (store) {
  return [
    {
      name: 'createProject',
      path: 'create',
      component: () => import('pages/ProjectCreate.vue')
    },
    {
      name: 'projectLanding',
      path: ':projectId',
      component: () => import('pages/project/Landing.vue')
    }
  ]
}
