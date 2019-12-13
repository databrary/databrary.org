import { visit, buildSchema, printIntrospectionSchema } from 'graphql'
// import { parseSchemaIntoAST } from 'graphql/language/schema'
import { gql } from 'apollo-server-express'
import _ from 'lodash'

const queryAsString = 'mutation {\n  createPost(title: "Title 1")\n}\n'
const query = gql`${queryAsString}`

const edits = [
  {
    'type': 'mutation',
    'edit': 'rename',
    'mutation': 'insert_project',
    'new': 'insert_asset'
  },
  {
    'type': 'mutation',
    'edit': 'addArgument',
    'mutation': 'insert_project',
    'argument': 'assetType',
    'value': 'project'
  }
]

function editAST (ast: any, edits: any) {
  let MUTATION = false
  let editedAST = visit(ast, {
    enter (node, key, parent, path, ancestors) {
      if (node.kind === 'OperationDefinition' && node.operation === 'mutation') {
        MUTATION = true
      }
      if (MUTATION && node.kind === 'Field') {

      }
      // console.log(JSON.stringify(node), key)
      if (key === 'name') {
        // console.log(node['value'])
        node['value'] = 'jeff'
      }
    },
    leave (node, key, parent, path, ancestors) {
      if (MUTATION && node.kind === 'OperationDefinition' && node.operation === 'mutation') {
        MUTATION = false
      }
    }
  })
  // console.log(JSON.stringify(editedAST))
}
//   })
// }

parse(query)  // TODO(Reda): Remove !
