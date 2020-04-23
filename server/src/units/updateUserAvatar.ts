import { adminMutate } from '../graphqlClient'

export async function updateUserAvatar (dbId: number, assetId: number, image?: object) {
  const response = await adminMutate(
    `${process.cwd()}/../gql/updateUserAvatar.gql`, {
      dbId: dbId,
      avatarId: assetId,
      image: image
    }
  )
  return response.returning[0].id
}