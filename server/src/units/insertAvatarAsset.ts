import { adminQuery } from '../graphqlClient'

export async function insertAvatarAsset (dbId: number) {
  const response = await adminQuery(
        `${process.cwd()}/../gql/insertAvatarAsset.gql`,
    {
      userId: dbId,
      name: `Avatar ${dbId}`
    })

  return response.returning[0].id
}