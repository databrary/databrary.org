import { Model, RelationMappings } from 'objection'
import User from './User'
import { join } from 'path'
import BaseModel from './BaseModel'
import * as _ from 'lodash'

const TYPES = {
  asset: {
    project: 1,
    file: 2
  },
  permission: {
    read: 1,
    write: 2,
    admin: 3
  }
}

export default class Project extends BaseModel {
  static tableName = 'projects'
  
  readonly id!: number
  name?: string
  // contributors?: User[]

  static jsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
    }
  }

  // static relationMappings: RelationMappings = {
  //   contributors: {
  //     relation: Model.ManyToManyRelation,
  //     modelClass: join(__dirname, 'User'),
  //     join: {
  //       from: 'projects.id',
  //       through: {
  //         from: 'users_projects.projectId',
  //         to: 'users_projects.userId'
  //       },
  //       to: 'users.id'
  //     }
  //   }
  // }

  static async modifyApiQuery(qb: any, { userId }) { 
    console.log(qb._operations[3])
    qb
      .where('projects._isHidden', false)
      .innerJoin('groups_users', function () {
        this
          .on('groups_users.userId', '=', _.toNumber(userId))
      })
      .innerJoin('groups_permissionsets', function () {
        this
          .on('groups_permissionsets.groupId', '=', 'groups_users.groupId')
          .on('groups_permissionsets.permissionsetId', '=', 'projects.permissionsetId')
      })
      .distinct('projects.id')
  }
}
