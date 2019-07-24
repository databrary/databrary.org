import { Model, RelationMappings } from 'objection'
import BaseModel from './BaseModel'
import { join } from 'path'

export default class PermissionSet extends BaseModel {
  static tableName = 'permissionSets'
  readonly id!: number
  type?: string
}
