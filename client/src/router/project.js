export default function routes (store) {
  return [
    {
      name: 'projectLanding',
      path: ':projectId',
      component: () => import('pages/project/Landing2.vue')
    }
  ]
}
