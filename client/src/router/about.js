// Reda: might need to rename paths for this routes
export default function routes (store) {
  return [
    {
      path: '/',
      name: 'about',
      component: () => import('pages/about/AboutProject.vue')
    },
    {
      path: 'about-databrary',
      name: 'about-databrary',
      component: () => import('pages/about/AboutDatabrary.vue')
    },
    {
      path: 'mission',
      name: 'mission',
      component: () => import('pages/about/Mission.vue')
    },
    {
      path: 'why-share-data',
      name: 'why-share-data',
      component: () => import('pages/about/WhyShareData.vue')
    },
    {
      path: 'use-cases',
      name: 'use-cases',
      component: () => import('pages/about/UseCases.vue')
    },
    {
      path: 'our-team',
      name: 'our-team',
      component: () => import('pages/about/OurTeam.vue')
    },
    {
      path: 'jobs',
      name: 'jobs',
      component: () => import('pages/about/Jobs.vue')
    },
    {
      path: 'press-and-publications',
      name: 'press-and-publications',
      component: () => import('pages/about/PressAndPublications.vue')
    },
    {
      path: 'news-letter',
      name: 'news-letter',
      component: () => import('pages/about/NewsLetter.vue')
    },
    {
      path: 'support',
      name: 'support',
      component: () => import('pages/about/Support.vue')
    }
  ]
}
