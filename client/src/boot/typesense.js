import { typesenseClient } from '../services/typesenseService'

export default async ({ Vue, store }) => {
  Vue.prototype.$typesense = typesenseClient
}
