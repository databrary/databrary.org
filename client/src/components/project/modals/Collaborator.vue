<template>
    <tr>
        <td>
            <q-icon name="drag_handle"/>
        </td>
        <td>
            <div class="row items-center">
                <Avatar
                    class="q-mr-md"
                    :src="src"
                />
                {{ collaborator.displayFullName }}
            </div>
        </td>
        <td class="text-center">
            <q-select
            class="fit"
            dense
            item-aligned
            v-model="collaborator.permission"
            :options="permissions"
            />
        </td>
        <td class="text-center">
            <q-checkbox v-model="collaborator.bibliographic" />
        </td>
        <td class="text-center">
            <q-icon
                size="sm"
                name="delete"
                @click.stop="$emit('remove', collaborator.docId)"
            />
        </td>
    </tr>
</template>

<script>
import Avatar from '@/components/shared/Avatar'

export default {
  name: 'Collaborator',
  props: {
    collaborator: {
      type: Object,
      required: true
    }
  },
  components: {
    Avatar
  },
  data: () => ({
    permissions: [
      {
        label: 'Administrator',
        value: 'administrator'
      },
      {
        label: 'Manager',
        value: 'manager'
      },
      {
        label: 'Read & Write',
        value: 'read_write'
      },
      {
        label: 'Read',
        value: 'read'
      }
    ]
  }),
  computed: {
    src () {
      return this.collaborator.useGravatar
        ? JSON.parse(this.collaborator.gravatar).large
        : JSON.parse(this.collaborator.image).large
    }
  }
}
</script>
