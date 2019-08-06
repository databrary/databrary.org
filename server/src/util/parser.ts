import * as _ from 'lodash'
import { parse, visit, print } from 'graphql'

import * as Knex from 'knex'
import * as knexConfig from '../../knexfile'
const knex = Knex(knexConfig.development)

const test = [{ id: 1, groups: [{ id: 1 }, { id: 2, users: [{ id: 8 }] }] }]
const testResult = [{ 'id': 1, 'groups': [{ 'id': 1 }, { 'id': 2, 'users': [{ 'id': 8 }], 'jeff': [{ 'id': 9, 'something': 'else' }] }] }]

function deepSetArray (obj, path, value) {
  let tmp = obj
  let foundIndex = null
  _.each(path, (pathComponent, i) => {
    const [key, search] = pathComponent
    if (key !== '') {
      if (!_.has(tmp, key)) {
        tmp[key] = []
      }
      tmp = tmp[key]
    }
    foundIndex = _.findIndex(tmp, search)
    if (foundIndex === -1) {
      tmp.push(search)
      foundIndex = _.size(tmp) - 1
    }
    tmp = tmp[foundIndex]
  })
  _.assign(tmp, value)
  return obj
}

JSON.stringify(deepSetArray(test, [['', { id: 1 }], ['groups', { id: 2 }], ['jeff', { id: 9 }]], { something: 'else' })) === JSON.stringify(testResult)

const doc = `
  query {
    project (id: 1) {
      id
      name
      groups {
        name
        users {
          fullName
        }
      }
    }
  }
`

const rules = [
  {
    singular: 'project',
    plural: 'projects',
    tableName: 'collections',
    relatedTo: {
      groups: function (chain: any) {
        return chain.innerJoin(
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
    }
  },
  {
    singular: 'group',
    plural: 'groups',
    tableName: 'groups',
    relatedTo: {
      users: function (chain: any) {
        return chain.innerJoin(
          'groups_users',
          'groups.id',
          'groups_users.groupId'
        )
        .innerJoin(
          'users',
          'groups_users.userId',
          'users.id'
        )
      }
    }
  },
  {
    singular: 'user',
    plural: 'users',
    tableName: 'users'
  }
]

function buildChain (knex) {
  const resultTemplate = {}
  return new Promise((resolve, reject) => {
    let chain: any = null
    const nesting = []
    const selection = []
    const relateds = []
    const ids = []
    let editedAST = visit(parse(doc), {
      enter (node, key, parent, path, ancestors) {
        if (node.kind === 'Field') {
          const type = node.name.value
          // TYPES/CLASSES/TABLES
          if (node.selectionSet) {
            // Find the type in our rules
            const rule =
                _.find(rules, { 'singular': node.name.value }) ||
                _.find(rules, { 'plural': node.name.value })
            // Extract the tableName for the type
            const table = rule.tableName
            if (_.isEmpty(nesting)) {
              chain = knex.from(rule.tableName)
            } else {
              const previous = _.last(nesting)
              const previousRule = _.find(rules, { 'tableName': previous.table })
              chain = previousRule.relatedTo[table](chain)
            }
            nesting.push({ type, table })

            const as = _.join(_.map(_.slice(nesting, 1), x => x.table), '.')
            const label = `${table}.id AS $${as}`
            ids.push(label)
          // FIELDS/COLUMNS
          } else {
            if (_.size(nesting) > 1) {
              const label = `${_.join(_.map(_.slice(nesting, 1), x => x.table), '.')}.${node.name.value}`
              selection.push(`${_.last(nesting).table}.${node.name.value} AS ${label}`)
            } else {
              _.set(resultTemplate, node.name.value, null)
              selection.push(`${_.last(nesting).table}.${node.name.value}`)
            }
          }
        }
      },
      leave (node, key, parent, path, ancestors) {
        if (node.kind === 'Field') {
          if (node.selectionSet) {
            nesting.pop()
          }
        }
        if (node.loc.start === 0) {
          _.each(ids, id => selection.push(id))
          resolve(chain.select(selection))
        }
      }
    })
  })
}

function resultsToGraphQL (results) {

}

async function main () {
  const chain = await buildChain(knex)
  // tslint:disable-next-line: await-promise
  console.log(chain)
}

// tslint:disable-next-line: no-floating-promises
main()

// chain.select(selection).then((data) => {
//   console.log(data)
// })

// console.log(parse(doc).definitions[0])
// console.log(JSON.stringify(parse(doc).definitions[0], null, 2))
// const result = parseGql(parse(doc).definitions[0].selectionSet.selections)
// console.log(result)
