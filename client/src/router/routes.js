
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: 'pages',
        component: () => import('pages/pages/pages.vue'),
      },
      {
        path: '/pages/contributors',
        component: () => import('pages/pages/contributors.vue'),
      },
      {
        path: '/pages/:pageId',
        component: () => import('pages/pages/pageId.vue'),
      },
      {
        path: '/search/:pageId',
        component: () => import('pages/pages/pageId.vue'),
      },
      { path: '/login', component: () => import('pages/login.vue') },
      { path: '/register', component: () => import('pages/register.vue') },
      { path: '/search', component: () => import('pages/pages/search.vue') },
      { path: '/notifications', component: () => import('pages/notifications.vue') },
      { path: '/messenger', component: () => import('pages/messenger.vue') },
      { path: '/settings', component: () => import('pages/settings.vue') },
      { path: '/news', component: () => import('pages/news.vue') },


    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
