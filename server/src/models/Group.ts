import { Model, RelationMappings } from 'objection'
import User from './User'
import { join } from 'path'
import BaseModel from './BaseModel'
import * as _ from 'lodash'

export default class Group extends BaseModel {
  static tableName = 'groups'
  readonly id!: number
  name?: string
  isGenerated?: string
  isIndividual?: string
  users?: User[]

  static jsonSchema = {
    type: 'object',
    required: [],

    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 }
    }
  }

  static relationMappings: RelationMappings = {
    users: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'User'),
      join: {
        from: 'groups.id',
        through: {
          from: 'groups_users.groupId',
          to: 'groups_users.userId'
        },
        to: 'users.id'
      }
    }
  }
}
