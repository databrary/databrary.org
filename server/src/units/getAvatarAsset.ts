import { adminQuery } from '../graphqlClient'

export async function getAvatarAsset (dbId: number) {
  const response = await adminQuery(
    `${process.cwd()}/../gql/getAvatarAsset.gql`,
    {
      dbId: dbId
    }
  )

  return response[0]
}
