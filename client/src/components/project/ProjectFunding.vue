<template>
  <div class="row">
    <div class="col-12">
      <div class="row justify-between">
        <q-card
          class="col-5 q-ma-sm"
          flat
          bordered
          v-for="funding in data"
          :key="funding.id"
        >
          <q-item>
            <q-item-section>
              <q-item-label>
                <span style="font-size: 1em">
                  {{funding.funder.name}}
                </span>
              </q-item-label>
              <q-item-label caption>
                <span>
                  {{funding.funder.doi}}
                </span>
              </q-item-label>
            </q-item-section>
            <q-item-section top side>
              <q-btn
                flat
                dense
                color="negative"
                icon="cancel"
                @click.stop="$emit('remove-funding', funding.id)"
              />
            </q-item-section>
          </q-item>
          <q-card-section>
            <div
              v-for="award in funding.awards"
              :key="award.id"
              class="cursor-pointer"
            >
              <span style="font-size: 0.75em">
                {{award.value}}
              </span>
              <q-popup-edit
                v-model.trim="award.value"
                @save="$emit('update-funding', funding.id, funding.awards)"
              >
                <template v-slot="{ initialValue, value, validate, set, cancel }">
                  <q-input
                    v-model.trim="award.value"
                    label="Award #"
                    hint="XXX-XXXXXX-XX"
                    mask="XXX-XXXXXX-XX"
                    dense
                    autofocus
                    counter
                  >
                    <template v-slot:after>
                      <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                      <q-btn flat dense color="positive" icon="check_circle" @click.stop="set" :disable="validate(value) === false || initialValue === value" />
                    </template>
                  </q-input>
                </template>
              </q-popup-edit>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  }

}
</script>
