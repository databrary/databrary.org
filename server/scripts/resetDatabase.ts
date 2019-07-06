import * as _ from 'lodash'
import * as pEachSeries from 'p-each-series'

import * as fs from 'fs'
import * as yaml from 'js-yaml'

import * as Knex from 'knex'
import * as knexConfig from '../knexfile'
import { Model } from 'objection'

import * as models from '../src/models'

async function go () {
  const knex = Knex(knexConfig.development)
  Model.knex(knex)

  await knex.migrate.down()
  await knex.migrate.up()

  const doc = yaml.safeLoad(
    fs.readFileSync('seeds/dev.yaml', 'utf8')
  );
  
  interface Seeds {
    model: string
    graph: any[]
  }

  await pEachSeries(doc, async (element: Seeds) => {
    const modelName = element.model
    const graph = element.graph
    await models[modelName].query().insertGraph(graph)
  })
  
  await knex.destroy()
}

// tslint:disable-next-line: no-floating-promises
go()