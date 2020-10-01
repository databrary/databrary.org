import {
  Controller,
  Res,
  Request,
  Post
} from '@nestjs/common'

import { isEmpty } from 'lodash'
import { SearchService } from './search.service'
import { Index } from '../common/types'
import { UserDTO } from '../dtos/user.dto'

@Controller('search')
export class SearchController {
  constructor (
    private readonly searchService: SearchService
  ) {}

  @Post()
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async search (@Request() req, @Res() res): Promise<[]> {
    try {
      const { search, types } = req.body

      if (isEmpty(search)) return res.json([])

      const results = {}

      for (const type of types) {
        let index: Index
        let queryBy: string

        switch (type) {
          case 'users':
            index = 'databrary-users'
            queryBy = UserDTO.fields
            break
        }

        if (index == null) continue

        const searchParameters = {
          q: search,
          query_by: queryBy
        }

        const docs = await this.searchService.searchTypesense(searchParameters, index)

        results[type] = docs.map(({ id, docId, ...doc }) => (doc))
      }

      return res.json(results)
    } catch (error) {
      console.error(error.message)
    }

    res.json([])
  }
}
