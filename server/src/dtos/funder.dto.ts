import { Index } from 'src/common/types'

export class FunderDTO {
  id: number

  doi: string

  name: string

  constructor (funder: Partial<FunderDTO>) {
    if (funder == null) throw new Error('Must provide a valid user object')

    this.id = funder.id
    this.doi = funder.doi
    this.name = funder.name
  }

  static readonly docFields = [
    { name: 'docId', type: 'int32' },
    { name: 'docIdS', type: 'string' },
    { name: 'doi', type: 'string' },
    { name: 'name', type: 'string' }
  ]

  get document (): Partial<Record<string, unknown>> {
    return {
      docId: this.id,
      docIdS: `${this.id}`,
      doi: this.doi,
      name: this.name
    }
  }

  static get schema (): Record<string, unknown> {
    const name: Index = 'databrary-funders'
    return {
      name: name,
      fields: FunderDTO.docFields,
      default_sorting_field: 'docId'
    }
  }
}
