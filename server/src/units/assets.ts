export async function getAsset( options: any ) {
  const knex = options.knex
  const assetId = options.id
  const projectTypeId = options.projectTypeId

  const results = await knex
    .select()
    .from('assets')
    .where('id', assetId)
  return 
}