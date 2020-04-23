import { adminMutate } from '../graphqlClient'

export async function insertFileObject (size: number, md5: string, sha1: string, sha256: string, location: string) {
  const response = await adminMutate(
    `${process.cwd()}/../gql/insertFileObjectOnUpload.gql`, {
      size: size,
      md5: md5,
      sha1: sha1,
      sha256: sha256,
      location: location
    }
  )

  return response.returning[0].id
}
