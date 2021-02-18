import { HasuraEvent, HasuraEventHandler } from '@golevelup/nestjs-hasura'
import { Injectable } from '@nestjs/common'
import { GQL_DIR } from 'src/common/constants'
import { DataciteService } from 'src/datacite/datacite.service'
import { GqlClientService } from 'src/gqlClient/gqlClient.service'

import { resolve } from 'path'
import { isEmpty } from 'lodash'

@Injectable()
export class ProjectService {
  constructor (
    private readonly dataCiteService: DataciteService,
    private readonly client: GqlClientService
  ) {}

  async getProject (id: number): Promise<Record<string, any>> {
    const { asset: project } = await this.client.adminQuery(
      resolve(GQL_DIR, 'getProjectsByPK.gql'),
      { id: id }
    )

    if (isEmpty(project)) return null

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { __typename, ...result } = project

    return result
  }

  async updateProjectDoi (id: string, doi: string): Promise<boolean> {
    const { returning: projects } = await this.client.adminMutate(
      resolve(GQL_DIR, 'updateProjectDoi.gql'),
      {
        id: id,
        doi: doi
      }
    )

    if (isEmpty(projects)) return false

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { __typename, ...project } = projects[0]

    return project.id != null
  }

  @HasuraEventHandler({
    triggerName: 'projects_insert'
  })
  async handleProjectInsert (evt: HasuraEvent): Promise<void> {
    try {
      const { new: { id } } = evt.event.data as Record<string, any>

      const { name, creator } = await this.getProject(id)

      const titles = [
        { title: name }
      ]

      const fullName = `${creator.givenName as string} ${creator.familyName as string}`
      const creators = [
        { name: fullName }
      ]

      const { data: { attributes: { doi } } } = await this.dataCiteService.addDoi(titles, creators)

      await this.updateProjectDoi(id, doi)
    } catch (error) {
      console.error(error.message)
    }
  }
}
