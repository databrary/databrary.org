import { HttpService, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
// import { AxiosResponse } from 'axios'
// import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class DataciteService {
  private readonly JSON_TYPE ='application/vnd.api+json'
  private readonly uri: string = this.configService.get('DATACITE_BASE_URL')
  private readonly prefix: string = this.configService.get('DATACITE_PREFIX')
  private readonly auth = {
    username: this.configService.get('DATACITE_USERNAME'),
    password: this.configService.get('DATACITE_PASSWORD')
  }

  private readonly data: Record<string, any> = {
    data: {
      type: 'dois',
      attributes: {
        event: 'publish',
        prefix: this.prefix,
        publisher: 'Databrary',
        publicationYear: new Date().getFullYear(),
        types: {
          resourceTypeGeneral: 'Dataset' // could use Audiovisual
        },
        url: 'https://schema.datacite.org/meta/kernel-4.0/index.html',
        schemaVersion: 'http://datacite.org/schema/kernel-4'
      }
    }
  }

  constructor (
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  async addDoi (titles: Array<Record<string, unknown>>, creators: Array<Record<string, unknown>>): Promise<Record<string, any>> {
    this.data.data.attributes.creators = creators
    this.data.data.attributes.titles = titles
    return await this.httpService
      .post(this.uri,
        this.data,
        {
          headers: { 'Content-Type': this.JSON_TYPE },
          auth: this.auth
        })
      .pipe(
        map(response => response.data)
      ).toPromise()
  }
}
