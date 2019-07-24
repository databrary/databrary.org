import { Model, RelationMappings } from 'objection'
import BaseModel from './BaseModel'
import Project from './Project'
// import Permission from './Permission'
import { join } from 'path'

export default class User extends BaseModel {
  static tableName = 'users'
  readonly id!: number
  fullName?: string
  projects?: Project[]
  // permissions?: Permission[]
  password?: string

  static jsonSchema = {
    type: 'object',
    required: ['fullName'],

    properties: {
      id: { type: 'integer' },
      fullName: { type: 'string', minLength: 1, maxLength: 255 }
    }
  }

  static relationMappings: RelationMappings = {
    groups: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'Group'),
      join: {
        from: 'users.id',
        through: {
          from: 'groups_users.userId',
          to: 'groups_users.groupId'
        },
        to: 'groups.id'
      }
    },
    projects: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'Project'),
      join: {
        from: 'users.id',
        through: {
          from: 'users_projects.userId',
          to: 'users_projects.projectId'
        },
        to: 'projects.id'
      }
    }
  }
}
