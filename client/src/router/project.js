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
      component: () => import('pages/Project/Landing.vue')
    },
    {
      name: 'uploadToProject',
      path: ':projectId/upload',
      component: () => import('components/Upload/FileUploader.vue')
    }
  ]
}
