<template>
  <div>
    <q-toolbar bordered fixed >
      <q-space />
      <q-btn flat color="primary" icon="person" class="float-right" to="pages/contributors">
        Manage Contributors
      </q-btn>
      <q-btn flat color="secondary" icon="add" class="float-right" @click="createPage()">
        Create page
      </q-btn>

    </q-toolbar>
    <q-page padding class="q-pt-none">

      <h4 class="no-margin text-weight-light">
        My Pages
      </h4>
      <p>Select from the list below to view or edit a page or click the create new page button!</p>
    <hr />
      <div class="flex flex-center">
        <router-link
          tag="a"
          class="flex inline shadow-box flex-center shadow-3"
          v-for="(page, index) in pages" :key="index"
          :to="'pages/' + index"
          tabindex="0"
        >
          {{ page.title }}
        </router-link>
      </div>
    </q-page>
  </div>
</template>
<script>
export default {
  name: 'Pages',
  data () {
    return {
      pages: [
        {
          title: 'Profile',
          template: `<q-page padding>
                      <div class="row">
                        <div class="col-12">
                          <q-carousel
                            arrows
                            animated
                            v-model="slide"
                            height="400px"
                          >
                            <q-carousel-slide name="first" img-src="https://cdn.quasar-framework.org/img/parallax1.jpg">
                              <div class="absolute-bottom custom-caption flex flex-center">
                                <q-avatar square size="148px">
                                  <img class="profile-border shadow-15" src="https://images.unsplash.com/photo-1525085475165-c6808cdb005e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=925&q=80" />
                                </q-avatar>
                              </div>
                            </q-carousel-slide>
                          </q-carousel>
                        </div>
                        <div class="col-12 flex flex-center q-pa-md">
                        <h5 class="q-ma-none"> Jenny Tomptson</h5>
                        </div>
                        <div class="col-3">
                          <q-card flat bordered>
                            <q-card-section>
                              <div class="text-h6">Contact</div>
                            </q-card-section>

                            <q-card-section>
                              <b>Email:</b> Email@email.com
                              <br/>
                              <b>Website:</b> website.com
                            </q-card-section>

                            <q-separator inset />

                            <q-card-section>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                              tempor incididunt ut labore et dolore magna aliqua.
                            </q-card-section>
                          </q-card>
                        </div>
                        <div class="col-9 q-pa-md">
                          <div class="text-h6">About Me</div>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Massa enim nec dui nunc mattis enim. A scelerisque purus semper eget duis at. Urna nec tincidunt praesent semper. Malesuada proin libero nunc consequat interdum. Mattis pellentesque id nibh tortor. Enim sit amet venenatis urna cursus eget nunc scelerisque. Sit amet porttitor eget dolor morbi. Auctor elit sed vulputate mi sit. Quis risus sed vulputate odio ut enim. Sed adipiscing diam donec adipiscing. Orci ac auctor augue mauris augue neque. Viverra orci sagittis eu volutpat odio facilisis mauris sit amet.
                          </p>
                          <div class="q-pb-md">
                            <div class="text-h6">Experience</div>
                            <q-timeline color="secondary">

                              <q-timeline-entry
                                title="Event Title"
                                subtitle="February 22, 1986"
                              >
                                <div>
                                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </div>
                              </q-timeline-entry>

                              <q-timeline-entry
                                title="Event Title"
                                subtitle="February 22, 1986"
                              >
                                <div>
                                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </div>
                              </q-timeline-entry>

                              <q-timeline-entry
                                title="Event Title"
                                subtitle="February 22, 1986"
                                color="orange"
                                icon="done_all"
                              >
                                <div>
                                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </div>
                              </q-timeline-entry>

                              <q-timeline-entry
                                title="Event Title"
                                subtitle="February 22, 1986"
                              >
                                <div>
                                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </div>
                              </q-timeline-entry>

                              <q-timeline-entry
                                title="Event Title"
                                subtitle="February 22, 1986"
                              >
                                <div>
                                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </div>
                              </q-timeline-entry>
                            </q-timeline>
                          </div>             
                      </div>
                      </div>
                    </q-page>`
        }
      ]
    }
  },
  methods: {
    createPage () {
      this.$q.notify({
        message: 'New page created',
        color: 'green'
      })
    }
  }
}
</script>
<style scoped>
.shadow-box {
  width: 150px;
  height: 200px;
  margin: 20px;
  border-radius: 5%;
  font-size: 12px;
}
.shadow-box:hover {
  cursor: pointer;
  box-shadow: 0 1px 8px rgba(0,0,0,0.4);
}

</style>
