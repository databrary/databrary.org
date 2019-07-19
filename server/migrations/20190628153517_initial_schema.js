const _ = require('lodash')

const tables = [
  'users', 'permissions', 'groups', 'projects', 'trees',
  'groups_users', 'users_projects', 'projects_trees'
]

exports.up = function(knex) {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary()
      table.string('fullName')
    })
    .createTable('permissions', table => {
      table.increments('id').primary()
      table.integer('assetId')
      table.integer('groupId')
      table.string('type')
    })
    .createTable('groups',  table => {
      table.increments('id').primary()
      table.string('name')
      table.string('isGenerated')
      table.string('isIndividual')
    })
    .createTable('projects', table => {
      table.increments('id').primary()
      table.string('title')
      table
        .string('_isHidden')
        .defaultTo(false)
    })
    .createTable('trees', table => {
      table.increments('id').primary()
      table.string('type')
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
  let chain = knex.schema
  _.each(_.reverse(tables), (name) => {
    chain = chain.dropTableIfExists(name)
  })
  return chain
}
