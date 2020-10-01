import _ from 'lodash'
import MeiliSearch from 'meilisearch'
import util from 'util'
import { readFileSync } from 'fs'
const { resolve } = require('path');
import rake from 'rake-js'
import moby from 'moby'

const sleep = util.promisify(setTimeout)

const searchClient = new MeiliSearch({
  host: 'http://127.0.0.1:7700'
})

async function main() {
  let data = readFileSync(resolve(__dirname, '../../data/karen_volumes.json'), 'utf8')
  data = JSON.parse(data)
  
  try {
    await searchClient.getIndex('projects').deleteIndex()
  } catch ( err ) {}

  let index
  try {
    index = await searchClient.createIndex('projects')
  } catch ( err ) {
    index = await searchClient.getIndex('projects')
  }

  const documents = _.compact(_.map(data, (doc) => {
    return {
      id: `project_${doc.id}`,
      doi: _.get(doc, 'doi'),
      year: doc.creation.substring(0, 4),
      name: doc.name,
      description: doc.body,
      owner: _.map(doc.owners, (owner) => owner.name),
      publicaccess: doc.publicaccess,
      collaborators: _.compact(_.map(doc.access, (party) => {
        if(_.get(party, 'party.institution')===true) return null
        return `${party.party.sortname}, ${party.party.prename}`
      })),
      // ages: _.get(doc, 'containers, '),
      ages: _.chain(doc)
        .get('containers')
        .filter(_.iteratee('records'))
        .flatMap('records')
        .filter(_.iteratee('age'))
        .flatMap('age')
        .value(),
      tags: _.map(doc.tags, (tag) => tag.id),
      keywords: _.uniq(_.flatten(_.map(rake(doc["name"] + ' ' + doc["body"]), (w) => w.split(' ')))),
      synonyms: _.uniq(_.compact(_.flatten(_.map(rake(doc["name"] + ' ' + doc["body"]), (word) => {
        const a = word.split(' ')
        return _.compact(_.flatten(_.map(a, (w) => {
          return moby.search(w)
        })))
      })))),
      wildcard: "*"
    }
  }))

  // console.log(_.flatMap(documents, 'ages').sort(function(a, b) {
  //   return b-a;
  // }))

  console.log(`Mapped #: ${documents.length}`)

  await index.addDocuments(documents)

  console.log(`Documents added`)

  let status
  const { updateId } = await index.updateAttributesForFaceting([
    'year',
    'owner',
    'publicaccess',
    'collaborators',
    'tags'
  ])
  do {
    await sleep(10)
    status = await index.getUpdateStatus(updateId)
  } while (status.status !== 'processed')
}


main()