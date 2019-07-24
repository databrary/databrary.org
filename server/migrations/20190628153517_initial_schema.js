const _ = require('lodash')

const tables = [
  'users', 'permissions', 'groups', 'permissionSets', 'projects', 'trees', 
  'permissionSets_assets', 'groups_users', 'users_projects', 'projects_trees'
]

const types = [
  'group_type', 'permissionsets_type', 'privacy_type'
]

// If you make a change here, change
//   src/models - class
//   src/models - jsonSchema
//   seeds/*.yaml
exports.up = function(knex) {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary()
      table.string('fullName')
      table.string('preferredName')
      table.string('password')
    })
    .createTable('permissions', table => {
      table.increments('id').primary()
      table.integer('groupId').index()
      table.string('type')
    })
    .createTable('groups',  table => {
      table.increments('id').primary()
      table.string('name')
      table.enu('type', 
        ['enclave', 'individual', 'generated', 'named'], 
        { useNative: true, enumName: 'group_type' }
      )
    })
    .createTable('permissionSets', table => {
      table.increments('id').primary()
      table.enu('type',
        ['new', 'inherited', 'follows'],
        { useNative: true, enumName: 'permissionsets_type' }
      )
      table.string('sourceTypedId')
      table.string('sourceGuid')
    })
    .createTable('projects', table => {
      table.increments('id').primary()
      table.string('title')
      table.enu('privacy', 
        ['public', 'private', 'protected'], 
        { useNative: true, enumName: 'privacy_type' }
      )
      table
        .boolean('_isHidden')
        .defaultTo(false)
    })
    .createTable('trees', table => {
      table.increments('id').primary()
      table.string('type')
    })
    // .createTable('enclaves', table => {
    //   table.increments('id').primary()
    //   table.string('name')
    // })
    // .createTable('enclaves_users', table => {
    //   table.increments('id').primary()
    //   table
    //     .string('enclaveId')
    //     .references('id')
    //     .inTable('enclaves')
    //     .index()
    //   table.integer('userId')
    //     .unsigned()
    //     .references('id')
    //     .inTable('users')
    //     .onDelete('CASCADE')
    //     .index()
    // })
    .createTable('permissionSets_assets', table => {
      table.increments('id').primary()
      table
        .integer('permissionSetId')
        .unsigned()
        .references('id')
        .inTable('permissionSets')
        .onDelete('CASCADE')
        .index()
      table
        .integer('assetId')
        .unsigned()
        .references('id')
        .inTable('assets')
        .onDelete('CASCADE')
        .index()
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
    .createTable('users_projects', table => {
      table.increments('id').primary()
      table
        .integer('userId')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .index()
      table
        .integer('projectId')
        .unsigned()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
        .index()
    })
    .createTable('projects_trees', table => {
      table.increments('id').primary()
      table
        .integer('projectId')
        .unsigned()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
        .index()
      table
        .integer('treeId')
        .unsigned()
        .references('id')
        .inTable('trees')
        .onDelete('CASCADE')
        .index()
    })
}

exports.down = function(knex) {

  const typesString = _.join(_.map(types, (type) => {
    return `DROP TYPE ${type}`
  }), ';')

  let chain = knex.schema
  _.each(_.reverse(tables), (name) => {
    chain = chain.dropTableIfExists(name)
  })
  return chain.then(() => {
    knex.schema.raw(typeString);
  })
}
