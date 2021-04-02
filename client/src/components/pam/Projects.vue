<template>
  <q-list>
    <q-expansion-item
      group="bookmarks"
      expand-separator
      default-opened
    >
      <template v-slot:header>
        <q-item-section avatar>
          <q-icon color="primary" name="art_track" />
        </q-item-section>

        <q-item-section class="text-bold">
          Pages
        </q-item-section>
        <q-item-section side>
          <q-icon
            name="add_circle_outline"
            @click.stop="$emit('update:createAssetType', 'project')"
          />
        </q-item-section>
      </template>

      <q-item
        clickable
        v-ripple
        v-for="project in projects"
        :key="project.id"
        @click="$emit('update:selectedProject', project.id)"
        :active="selectedProject == project.id"
        active-class="bg-teal-1 text-grey-8"
        class="col-12 q-pl-md"
      >
        <q-item-section avatar>
          <q-icon color="primary" name="preview" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{project.name}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'PageIndex',
  props: [
    'createAssetType',
    'selectedProject',
    'projects'
  ]
}
</script>
