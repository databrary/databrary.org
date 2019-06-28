
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
      { path: '/settings', component: () => import('pages/settings.vue') },
      { path: '/news', component: () => import('pages/news.vue') },
      {
        path: '/about',
        component: () => import('pages/about/index.vue'),
        children: [
          { path: '/about', component: () => import('pages/about/AboutProject.vue') },

          {
            path: '/about/about-databrary',
            component: () => import('pages/about/AboutDatabrary.vue'),
          },
          {
            path: '/about/mission',
            component: () => import('pages/about/Mission.vue'),
          },
          {
            path: '/about/why-share-data',
            component: () => import('pages/about/WhyShareData.vue'),
          },
          {
            path: '/about/use-cases',
            component: () => import('pages/about/UseCases.vue'),
          },
          {
            path: '/about/our-team',
            component: () => import('pages/about/OurTeam.vue'),
          },
          {
            path: '/about/jobs',
            component: () => import('pages/about/Jobs.vue'),
          },
          {
            path: '/about/press-and-publications',
            component: () => import('pages/about/PressAndPublications.vue'),
          },
          {
            path: '/about/news-letter',
            component: () => import('pages/about/NewsLetter.vue'),
          },
          {
            path: '/about/support',
            component: () => import('pages/about/Support.vue'),
          },
        ],
      },
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
