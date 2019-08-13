export const rules = [
  {
    singular: 'project',
    plural: 'projects',
    tableName: 'collections',
    relatedTo: {
      groups: function (chain: any) {
        return chain.innerJoin(
          'groups_permissionsets',
          'collections.permissionsetId',
          'groups_permissionsets.permissionsetId'
        )
        .innerJoin(
          'groups',
          'groups_permissionsets.groupId',
          'groups.id'
        )
      }
    }
  },
  {
    singular: 'group',
    plural: 'groups',
    tableName: 'groups',
    relatedTo: {
      users: function (chain: any) {
        return chain.innerJoin(
          'groups_users',
          'groups.id',
          'groups_users.groupId'
        )
        .innerJoin(
          'users',
          'groups_users.userId',
          'users.id'
        )
      }
    }
  },
  {
    singular: 'user',
    plural: 'users',
    tableName: 'users'
  }
]
