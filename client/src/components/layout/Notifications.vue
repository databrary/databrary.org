<template>
    <q-btn
        dense
        flat
        class="text-weight-light text-grey-8 q-ma-sm"
        icon="notifications"
    >
        <q-badge color="red-5" floating>3</q-badge>
        <q-menu>
            <q-list>
                <q-item clickable v-close-popup>
                    <q-item-section>
                        <q-item-label>Page edit</q-item-label>
                        <q-item-label class="text-caption">
                            Clair edited landing page
                        </q-item-label>
                    </q-item-section>
                </q-item>

                <q-separator inset/>

                <q-item clickable v-close-popup>
                    <q-item-section>
                        <q-item-label>Contributor added</q-item-label>
                        <q-item-label class="text-caption">
                            Clair was added to PROJECT
                        </q-item-label>
                    </q-item-section>
                </q-item>

                <q-separator inset/>

                <q-item clickable v-close-popup>
                    <q-item-section>
                        <q-item-label>Message</q-item-label>
                        <q-item-label class="text-caption">
                            Rick messaged you
                        </q-item-label>
                    </q-item-section>
                </q-item>

                <q-separator class="gt-sm" inset/>

                <q-item
                    to="/notifications"
                    clickable
                    v-close-popup
                    class="q-pa-none"
                >
                    <q-item-section class="text-center text-grey-10">
                        View all notifications
                    </q-item-section>
                </q-item>
            </q-list>
        </q-menu>
    </q-btn>
</template>

<script>
export default {

}
</script>
