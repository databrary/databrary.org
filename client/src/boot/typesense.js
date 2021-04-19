import { typesense } from '../services/typesenseClient'

export default async ({ Vue, store }) => {
  Vue.prototype.$typesense = typesense
}
