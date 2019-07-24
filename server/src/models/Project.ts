import { Model, RelationMappings } from 'objection'
import User from './User'
import { join } from 'path'
import BaseModel from './BaseModel'
import * as _ from 'lodash'

export default class Project extends BaseModel {
  static tableName = 'projects'
  
  readonly id!: number
  title?: string
  contributors?: User[]

  static jsonSchema = {
    type: 'object',
    required: ['title'],

    properties: {
      id: { type: 'integer' },
      title: { type: 'string', minLength: 1, maxLength: 255 },
    }
  }

  static relationMappings: RelationMappings = {
    contributors: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'User'),
      join: {
        from: 'projects.id',
        through: {
          from: 'users_projects.projectId',
          to: 'users_projects.userId'
        },
        to: 'users.id'
      }
    }
  }

  static async modifyApiQuery(qb: any, { userId }) { 
    console.log(qb._operations[3])
    qb
      .where('projects._isHidden', false)
      // .where('id', 'in', subquery)
      .innerJoin('permissions', function() {
        this
          .on('permissions.assetId', '=', 'projects.id')
      })
      .innerJoin('groups_users', function () {
        this
          .on('groups_users.userId', '=', _.toNumber(userId))
          .on('groups_users.groupId', '=', 'permissions.groupId')
      })
  }
}
