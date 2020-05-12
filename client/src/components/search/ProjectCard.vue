<template>
    <q-card square flat bordered>
        <q-card-section>
            <router-link class="text-primary" :to="'search/' + index" exact>
                <div class="text-h6">Result {{index}}</div>
            </router-link>
        </q-card-section>

        <q-card-section>
            <q-expansion-item
                label-lines="2"
                label="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip"
                caption="Admin, AdminSteiger, LisaTesla, Testarosa"
                >
                <q-card>
                    <q-card-section>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Quidem, eius reprehenderit eos corrupti
                    </q-card-section>
                </q-card>
            </q-expansion-item>
        </q-card-section>
    </q-card>
</template>

<script>
export default {
  name: 'ProjectCard',
  props: [ 'project' ]
}
</script>
