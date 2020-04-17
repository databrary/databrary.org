export default function routes (store) {
  return [
    {
      name: 'profile',
      path: 'profile',
      component: () => import('components/settings/settingsProfile.vue')
    },
    {
      name: 'emails',
      path: 'emails',
      component: () => import('components/settings/settingsEmails.vue')
    },
    {
      name: 'account',
      path: 'account',
      component: () => import('components/settings/settingsAccount.vue')
    },
    {
      name: 'security',
      path: 'security',
      component: () => import('components/settings/settingsSecurity.vue')
    }

  ]
}
