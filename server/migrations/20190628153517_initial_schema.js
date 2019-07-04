exports.up = function(knex) {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary()
      table.string('fullName')
    })
    .createTable('permissions', table => {
      table.increments('id').primary()
      table.integer('userId')
      table.integer('assetId')
      table.string('type')
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
  return knex.schema
    .dropTableIfExists('projects_trees')
    .dropTableIfExists('users_projects')
    .dropTableIfExists('trees')
    .dropTableIfExists('projects')
    .dropTableIfExists('permissions')
    .dropTableIfExists('users')
}
