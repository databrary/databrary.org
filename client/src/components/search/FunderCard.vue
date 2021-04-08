<template>
    <q-card
        class="row"
        square
        flat
        bordered
    >
        <q-item
            class="col-12"
        >
            <q-item-section>
                <q-item-label>
                    <span>{{funder.name}}</span>
                </q-item-label>
                <q-item-label caption>
                    <span>{{funder.doi}}</span>
                </q-item-label>
            </q-item-section>
        </q-item>
    </q-card>
</template>

<script>
export default {
  name: 'FunderCard',
  props: ['funder']
}
</script>
