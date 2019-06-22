<template>
  <div>
    <q-drawer
      side="left"
      v-model="drawer"
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      :width="300"
      :breakpoint="500"
      bordered
      show-if-above
    >
      <q-list padding>
        <q-item clickable v-ripple>
          <q-item-section side>
            <q-avatar size="48px" color="gray" text-color="gray" icon="add" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Create New Message</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator inset />
        <div v-for="(n, index) in 6" :key="index">
          <q-item clickable v-ripple>
            <q-item-section side>
              <q-avatar size="48px">
                <img :src="'https://cdn.quasar-framework.org/img/avatar' + n + '.jpg'" />
                <q-badge v-if="n === 1" floating color="primary">new</q-badge>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>Mary</q-item-label>
              <q-item-label caption>{{n}} new messages</q-item-label>
            </q-item-section>
            <q-item-section side>
              {{3*n}} min ago
            </q-item-section>
          </q-item>
          <q-separator inset />
        </div>
      </q-list>
    </q-drawer>
    <q-page class="row">
      <div class="col-xs-12 col-sm-12 col-md-12">
        <div class="q-pa-md row full-chat-height justify-center">
          <div style="width: 100%;">
            <q-chat-message
              name="me"
              avatar="https://cdn.quasar-framework.org/img/avatar1.jpg"
              :text="['hey, how are you?']"
              sent
            />
            <q-chat-message
              name="Jane"
              avatar="https://cdn.quasar-framework.org/img/avatar2.jpg"
              :text="['doing fine, how r you?']"
            />
          </div>
        </div>
        <q-input class="q-pa-sm " bottom-slots v-model="message"
          label="Label" counter dense>
          <template v-slot:before>
            <q-avatar>
              <img src="https://cdn.quasar-framework.org/img/avatar1.jpg">
            </q-avatar>
          </template>
          <template v-slot:after>
            <q-btn round dense flat icon="send" />
          </template>
        </q-input>
      </div>
    </q-page>
  </div>
</template>
<script>
export default {
  data() {
    return {
      drawer: false,
      miniState: true,
      message: '',
    };
  },
};
</script>
<style>
.full-chat-height {
  height: calc(100% - 82px);
}
.window-chat-height {
  height: calc(100vh - 43px);
}
</style>
