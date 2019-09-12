import * as _ from 'lodash'
import { visit } from 'graphql'

import { nest } from './nest'

// const doc = `
//   query {
//     project (id: 1) {
//       id
//       name
//       groups {
//         name
//         users {
//           fullName
//         }
//       }
//     }
//   }
// `

function buildChain (knex: any, ast: any, rules: any) {
  const resultTemplate = {}
  return new Promise((resolve, reject) => {
    let chain: any = null
    const nesting = []
    const selection = []
    const relateds = []
    const ids = []
    // const ast = parse(doc)
    let startingLoc = null
    let endingLoc =  null
    let editedAST = visit(ast, {
      enter (node, key, parent, path, ancestors) {
        if (node.kind === 'Field') {
          if( !startingLoc && !endingLoc) {
            startingLoc = node.loc.start
            endingLoc = node.loc.end
          }
          const type = node.name.value
          // TYPES/CLASSES/TABLES
          if (node.selectionSet) {
            // Find the type in our rules
            const rule =
                _.find(rules, { 'singular': type }) ||
                _.find(rules, { 'plural': type })
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
            const label = `${table}.id AS ${as}$`
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
        if (node.loc.start === startingLoc && node.loc.end === endingLoc) {
          _.each(ids, id => selection.push(id))
          chain = chain.select(selection)
          console.log(chain.toString())
          resolve(chain)
        }
      }
    })
  })
}

export async function buildResolver (knex: any, ast: any, rules: any) {
  const results = await buildChain(knex, ast, rules)
  return nest(results)
}
