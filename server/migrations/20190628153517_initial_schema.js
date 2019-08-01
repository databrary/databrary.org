const _ = require('lodash')

const tables = [
  'assetTypes', 'permissionTypes',
  'users', 'groups', 'groups_users', 'permissionsets', 'groups_permissionsets',
  'collections', 'collections_permissionsets',
]

const types = [
  'group_type', 'permissionsets_type', 'privacy_type'
]

function createTypes(chain) {
  const typesString = `
    CREATE TYPE permissionsets_type AS ENUM ('new', 'inherited', 'follows');
  `
  return chain.raw(typesString)
}

function collectionClass(table) {
  table.increments('id').primary()
  table.string('name')
  table
    .integer('permissionsetId')
    .references('id')
    .inTable('permissionsets')
  table
    .enu('permissionsetType',
      null,
      { useNative: true, existingType: true, enumName: 'permissionsets_type' }
    )
}

function assetClass(table) {
  table.increments('id').primary()
  table.string('name')
  table
    .integer('permissionsetId')
    .references('id')
    .inTable('permissionsets')
  table
    .enu('permissionsetType',
      null,
      { useNative: true, existingType: true, enumName: 'permissionsets_type' }
    )
}

function assetMetadataClass(table) {
  table.increments('id').primary()
  table.string(schema)
}

function assetDataClass(table) {
  table.increments('id').primary()
  table.string('md5')
}

// If you make a change here, change
//   src/models - class
//   src/models - jsonSchema
//   seeds/*.yaml
exports.up = function(knex) {
  let chain = knex.schema

  chain = createTypes(chain)

  chain = chain
    .createTable('permissionTypes', table => {
      table.increments('id').primary()
      table.string('name').notNullable()
    })
    .createTable('assetTypes', table => {
      table.increments('id').primary()
      table.string('name').notNullable()
    })

  chain = chain
    .createTable('users', table => {
      table.increments('id').primary()
      table.string('fullName')
      table.string('preferredName')
      table.string('password')
      table.boolean('isConfirmed').defaultTo(false)
    })
    .createTable('groups',  table => {
      table.increments('id').primary()
      table.string('name')
      table.enu('type', 
        ['enclave', 'individual', 'generated', 'named'], 
        { useNative: true, enumName: 'group_type' }
      ).notNullable()
    })
    .createTable('groups_users', table => {
      table.increments('id').primary()
      table
        .integer('groupId')
        .unsigned()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE')
        .index()
      table
        .integer('userId')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .index()
    })
    .createTable('permissionsets', table => {
      table.increments('id').primary()
      table.integer('sourceId')
      table.integer('sourceAssetTypeId')
      table.string('sourceGuid')
    })
    .createTable('groups_permissionsets', table => {
      table.increments('id').primary()
      table
        .integer('groupId')
        .unsigned()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE')
        .index()
        .notNullable()
      table
        .integer('permissionsetId')
        .unsigned()
        .references('id')
        .inTable('permissionsets')
        .onDelete('CASCADE')
        .index()
        .notNullable()
      table.integer('permissionTypeId').notNullable()
    })
  
  chain = chain
    .createTable('collections', table => {
      assetClass(table)
      table.text('description')
      table.enu('privacy', 
        ['public', 'private', 'protected'], 
        { useNative: true, enumName: 'privacy_type' }
      )
      table
        .boolean('_isHidden')
        .defaultTo(false)
    })
  
  return chain
}

exports.down = function(knex) {

  const typesString = _.join(_.map(types, (type) => {
    return `DROP TYPE IF EXISTS ${type}`
  }), '; ')

  let chain = knex.schema
  _.each(_.reverse(tables), (name) => {
    chain = chain.dropTableIfExists(name)
  })

  return chain.raw(typesString)
}
