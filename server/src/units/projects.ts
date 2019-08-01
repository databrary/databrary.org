import { createGroup } from './groups'
import * as _ from 'lodash'

const schema = [
  {
    singular: 'project',
    plural: 'projects',
    tableName: 'collections',
    where: (knex: any, args: any) => {
      return knex.where('collections.id', args.id)
    },
    nested: [
      {
        singular: 'group',
        plural: 'groups',
        tableName: 'groups',
        join: (knex: any, args: any) => {
          return knex.innerJoin(
            'groups_permissionsets',
            'collections.permissionsetId',
            'groups_permissionsets.permissionsetId'
          )
        }
      }
    ]
  }

]

function gqlToKnex (nodes) {

}

export async function getProject (options: any) {
  const knex = options.knex
  const assetId = options.id
  const projectTypeId = options.projectTypeId
  let selection = options.select

  const includeGroups = _.includes(selection, 'groups')
  if (includeGroups) {
    _.remove(selection, (x) => x === 'groups')
  }

  selection = _.map(selection, (column) => {
    return `collections.${column} as ${column}`
  })

  selection.push('groups.name as groups.name')

  const m = {
    projects: ''
  }

  let chain = knex
    .select(selection)
    .from('collections')
    .where('collections.id', assetId)
    // .andWhere('type', projectTypeId)
  if (includeGroups) {
    chain = chain
      .innerJoin(
        'groups_permissionsets',
        'collections.permissionsetId',
        'groups_permissionsets.permissionsetId'
      )
      .innerJoin(
        'groups',
        'groups_permissionsets.groupId',
        'groups.id'
      )
  }

  const results = await chain

  return results
}

export async function createProject (options: any) {
  const [ permissionsetId ] = await options.knex('permissionsets')
    .returning('id')
    .insert({
      // type: 'new',
      // sourceId: projectId,
      // sourceAssetTypeId: lookup('asset', 'project')
    })

  const [ projectId ] = await options.knex('collections')
    .returning('id')
    .insert({
      name: options.name,
      description: options.description,
      permissionsetId
    })

  const groupId = await createGroup({
    knex: options.knex,
    name: `collection:project:${projectId}:admins`,
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

  return projectId
}
