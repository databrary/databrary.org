<template>
  <q-list>
    <q-item
      @click="onClickData"
      clickable
      v-ripple
      active-class="bg-teal-1 text-grey-8"
    >
      <q-item-section avatar>
          <q-icon color="primary" name="folder" />
      </q-item-section>
      <q-item-section>
        <q-item-label lines="1">Session 1</q-item-label>
      </q-item-section>
    </q-item>
        <q-item
      @click="onClickData"
      clickable
      v-ripple
      active-class="bg-teal-1 text-grey-8"
    >
      <q-item-section avatar>
          <q-icon color="primary" name="folder" />
      </q-item-section>
      <q-item-section>
        <q-item-label lines="1">Session 2</q-item-label>
      </q-item-section>
    </q-item>
        <q-item
      @click="onClickData"
      clickable
      v-ripple
      active-class="bg-teal-1 text-grey-8"
    >
      <q-item-section avatar>
          <q-icon color="primary" name="folder" />
      </q-item-section>
      <q-item-section>
        <q-item-label lines="1">Session 3</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
