import { createGroup } from './groups'

export async function createProject( options: any ) {
  const [ permissionsetId ] = await options.knex('permissionsets')
    .returning('id')
    .insert({
      // type: 'new',
      // sourceId: projectId,
      // sourceAssetTypeId: lookup('asset', 'project')
    })

  const [ projectId ] = await options.knex('projects')
    .returning('id')
    .insert({
      name: options.name,
      description: options.description,
      permissionsetId
    })
  
  const groupId = await createGroup({
    knex: options.knex,
    name: `asset:project:${projectId}:admins`,
    type: 'generated',
    userIds: [ options.userId ]
  })

  await options.knex('groups_permissionsets')
    .returning('id')
    .insert({
      groupId,
      permissionsetId,
      permissionTypeId: options.permissionTypeId
    })

  await options.knex('assets_permissionsets')
    .insert({
      assetId: projectId,
      assetTypeId: options.assetTypeId,
      permissionsetId
    })
  
  return projectId
}