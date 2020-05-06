import _ from 'lodash'
import { Request, Response } from 'express'
import { logger } from '../shared'
import { esClient } from '../shared/elasticsearch'

export const search = async (req: Request, res: Response) => {
  try {
    const { search } = req.body

    if (_.isEmpty(search)) return res.json([])

    const { body: { hits: { hits } } } = await esClient.search({
      index: 'databrary-*',
      body: {
        query: { multi_match : { query : search } }
      }
    })

    if (_.isEmpty(hits)) return res.json([])

    const result = hits.map(({ id, _index: index, _score: score,_source: { doc, ...ingest } }) => {
      const user = _.isEmpty(ingest) ? doc : ingest
      return { index, id, score, ...user }
    })

    res.json(result)
  } catch (error) {
    logger.error(`error`)
  }
}
