import pMapSeries from 'p-map-series'

export async function createGroup( options: any ) {
  const [groupId] = await options.knex('groups')
    .returning('id')
    .insert({
      name: options.name,
      type: options.type
    })
  
  if(options.userIds) {
    await pMapSeries(options.userIds, (userId) => {
      return options.knex('groups_users').insert({
        groupId,
        userId
      })
    })
  }
  return groupId
}