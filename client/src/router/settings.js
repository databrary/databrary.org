export default function routes (store) {
  return [
    {
      path: 'profile',
      name: 'Profile',
      component: () => import('pages/settings/Profile.vue')
    },
    {
      path: 'account',
      name: 'Account',
      component: () => import('pages/settings/Account.vue')
    },
    {
      path: 'emails',
      name: 'Emails',
      component: () => import('pages/settings/Emails.vue')
    },
    {
      path: 'security',
      name: 'Security',
      component: () => import('pages/settings/Security.vue')
    }
  ]
}
