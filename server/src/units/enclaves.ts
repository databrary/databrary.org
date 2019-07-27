import { getProjectPermissionSetId, getAssetPermissionSetId } from './permissions'

export async function addUserToEnclave( options: any ) {
  const groupId = options.enclaveId
  await options.knex('groups_users')
    .insert({
      groupId,
      userId: options.userId
    })
  return groupId
}

export async function addProjectToEnclave( options: any) {
  const groupId = options.enclaveId
  
  let permissionsetId = null
  if( options.permissionSetId ) {
    permissionsetId = options.permissionSetId
  } else if ( options.projectId ) {
    permissionsetId = await getProjectPermissionSetId(options)
  } else if( options.assetId && options.assetTypeId ) {
    permissionsetId = await getAssetPermissionSetId( options )
  } else {
    throw new Error('database error')
  }
  
  await options.knex('groups_permissionsets')
    .insert({
      groupId,
      permissionsetId,
      permissionTypeId: options.permissionTypeId
    })
}