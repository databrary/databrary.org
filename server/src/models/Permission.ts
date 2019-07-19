import { Model, RelationMappings } from 'objection'
import BaseModel from './BaseModel'
import { join } from 'path'

export default class Permission extends BaseModel {
  static tableName = 'permissions'
  readonly id!: number
  groupId?: number
  assetId?: number
  type?: string
}
