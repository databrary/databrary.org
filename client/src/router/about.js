export default function routes (store) {
  return [
    { path: '/', component: () => import('pages/about/AboutProject.vue') },

    {
      path: 'about-databrary',
      component: () => import('pages/about/AboutDatabrary.vue')
    },
    {
      path: 'mission',
      component: () => import('pages/about/Mission.vue')
    },
    {
      path: 'why-share-data',
      component: () => import('pages/about/WhyShareData.vue')
    },
    {
      path: 'use-cases',
      component: () => import('pages/about/UseCases.vue')
    },
    {
      path: 'our-team',
      component: () => import('pages/about/OurTeam.vue')
    },
    {
      path: 'jobs',
      component: () => import('pages/about/Jobs.vue')
    },
    {
      path: 'press-and-publications',
      component: () => import('pages/about/PressAndPublications.vue')
    },
    {
      path: 'news-letter',
      component: () => import('pages/about/NewsLetter.vue')
    },
    {
      path: 'support',
      component: () => import('pages/about/Support.vue')
    }
  ]
}
