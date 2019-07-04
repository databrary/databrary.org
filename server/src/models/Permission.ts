import { Model, RelationMappings } from 'objection'
import BaseModel from './BaseModel'
import { join } from 'path'

export default class Permission extends BaseModel {
  static tableName = 'permissions'
  readonly id!: number
  userId?: number
  assetId?: number
  type?: string

  // static jsonSchema = {
  //   type: 'object',
  //   required: ['fullName'],

  //   properties: {
  //     id: { type: 'integer' },
  //     fullName: { type: 'string', minLength: 1, maxLength: 255 }
  //   }
  // }

  // static relationMappings: RelationMappings = {
  //   projects: {
  //     relation: Model.ManyToManyRelation,
  //     modelClass: join(__dirname, 'Project'),
  //     join: {
  //       from: 'users.id',
  //       through: {
  //         from: 'users_projects.userId',
  //         to: 'users_projects.projectId'
  //       },
  //       to: 'projects.id'
  //     }
  //   }
  // }
}
