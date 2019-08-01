import * as _ from 'lodash'
import { parse, visit, print } from 'graphql'

import * as Knex from 'knex'
import * as knexConfig from '../../knexfile'
const knex = Knex(knexConfig.development)

const doc = `
  query {
    project (id: 1) {
      id
      name
      group {
        name
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
      groups: function(chain) {
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
    tableName: 'groups'
  }
]

function buildChain () {
  return new Promise((resolve, reject) => {
    let chain: any = null
    const nesting = []
    const selection = []
    let editedAST = visit(parse(doc), {
      enter (node, key, parent, path, ancestors) {
        if (node.kind === 'Field') {
          const type = node.name.value
          if (node.selectionSet) {
            const rule =
                _.find(rules, { 'singular': node.name.value }) ||
                _.find(rules, { 'plural': node.name.value })
            const table = rule.tableName
            if (_.isEmpty(nesting)) {
              chain = knex.from(rule.tableName)
            }
            nesting.push({type, table})
          } else {
            selection.push(`${_.last(nesting).table}.${node.name.value} AS ${_.last(nesting).table}_._${node.name.value}`)
          }
        }
      },
      leave (node, key, parent, path, ancestors) {
        if (node.kind === 'Field') {
          if (node.selectionSet) {
            if (_.size(nesting) > 1) {
              const current = nesting.pop()
              const previous = _.last(nesting)
              const rule = _.find(rules, {'tableName': previous.table})
              chain = rule.relatedTo[current.table](chain)
            } else {
              nesting.pop()
            }
          }
        }
        if (node.loc.start === 0) {
          resolve(chain.select(selection))
        }
      }
    })
  })
}

async function main () {
  const chain = await buildChain()
  // tslint:disable-next-line: await-promise
  const data = await chain
  console.log(data)
}

main()

// chain.select(selection).then((data) => {
//   console.log(data)
// })

// console.log(parse(doc).definitions[0])
// console.log(JSON.stringify(parse(doc).definitions[0], null, 2))
// const result = parseGql(parse(doc).definitions[0].selectionSet.selections)
// console.log(result)
