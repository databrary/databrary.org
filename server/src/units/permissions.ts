export async function getProjectPermissionSetId( options: any ) {
  const knex = options.knex
  const projectId = options.projectId
  const [{ permissionsetId}] = await knex
    .select('permissionsetId')
    .from('projects')
    .where('id', projectId)
  return permissionsetId
}

export async function getAssetPermissionSetId ( options: any ) {
  const knex = options.knex
  const assetTypeId = options.assetTypeId
  const assetId = options.assetId
  const [{permissionsetId}] = await knex
    .select('permissionsetId')
    .from('assets_permissionsets')
    .where('assets_permissionsets.assetId', '=', assetId)
    .andWhere('assets_permissionsets.assetTypeId', '=', assetTypeId)
  return permissionsetId
}