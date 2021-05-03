<template>
    <tr v-if="collaborator">
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
          <div>
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]"
              v-if="disablePermission"
            >
              You need at least one Administrator
            </q-tooltip>
            <q-select
              class="fit"
              dense
              item-aligned
              :value="permission"
              :disable="disablePermission"
              @input="(value) => $emit('update:permission', value.label)"
              :options="permissions"
            />
          </div>
        </td>
        <td class="text-center">
          <div>
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]"
              v-if="disableBibliographic"
            >
              You need at least one bibliograhic contributor
            </q-tooltip>
            <q-checkbox
              :disable="disableBibliographic"
              :value="bibliographic"
              @input="(value) => $emit('update:bibliographic', value)"
            />
          </div>
        </td>
        <td class="text-center">
          <div>
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]"
              v-if="errorMessage"
            >
              {{errorMessage}}
            </q-tooltip>
            <q-btn
              flat
              dense
              :disable="disableRemove"
              @click.stop="$emit('remove', id)"
            >
              <q-icon
                  size="sm"
                  name="delete"
              />
            </q-btn>
          </div>
        </td>
    </tr>
</template>

<script>
import { call } from 'vuex-pathify'
import Avatar from '@/components/shared/Avatar'

export default {
  name: 'Collaborator',
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    permission: {
      type: String,
      required: true
    },
    bibliographic: {
      type: Boolean,
      required: true
    },
    disablePermission: {
      type: Boolean,
      required: false,
      default: () => false
    },
    disableBibliographic: {
      type: Boolean,
      required: false,
      default: () => false
    },
    disableRemove: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  components: {
    Avatar
  },
  data: () => ({
    collaborator: null,
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
  async created () {
    this.collaborator = await this.getCollaboratorData()
  },
  watch: {
    async id () {
      this.collaborator = await this.getCollaboratorData()
    },
    permission (newValue, oldValue) {
      if (oldValue === 'Administrator' && newValue !== 'Administrator') {
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'warning',
          message: `${this.collaborator.displayFullName} will no longer have Admin access to this page.`
        })
      }
    },
    bibliographic (newValue) {
      if (!newValue) {
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'warning',
          message: `This will remove ${this.collaborator.displayFullName} from the list of bibliographic contributors.`
        })
      }
    }
  },
  computed: {
    src () {
      return this.collaborator.useGravatar
        ? JSON.parse(this.collaborator.gravatar).large
        : JSON.parse(this.collaborator.image).large
    },
    errorMessage () {
      return this.disableRemove ? this.buildErrorMessage() : ''
    }
  },
  methods: {
    getUserById: call('search/getUserById'),
    async getCollaboratorData () {
      return this.getUserById({ id: this.id })
    },
    buildErrorMessage () {
      if (this.disableBibliographic && this.disablePermission) {
        return 'You cannot delete the last Administrator and bibliographic contributor'
      } else if (this.disableBibliographic) {
        return 'You cannot delete the last bibliographic contributor'
      } else if (this.disablePermission) {
        return 'You cannot delete the last Administrator'
      }

      return ''
    }
  }
}
</script>
