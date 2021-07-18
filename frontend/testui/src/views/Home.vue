<template>
  <v-row
    align="start"
    class="list px-3 mx-auto"
  >
    <v-col
      cols="12"
      sm="12"
    >
      <v-card
        class="mx-auto spacing-playground pa-6"
        tile
      >
        <v-card-title>ISO15118-2 Messages </v-card-title>
        <v-data-table
          :headers="headers"
          :items="this.get_summary"
          :items-per-page="-1"
          :disable-pagination="true"
          :hide-default-footer="true"
          :loading="isLoading"
          dense
          loading-text="Loading... Please wait"
          @click:row="selectMsg"
        >
          <template #[`item.CMN`]="{ item }">
            <span> {{ item.CMN.pass }} / {{ item.CMN.total }} </span>
          </template>
          <template #[`item.AC`]="{ item }">
            <span> {{ item.AC.pass }} / {{ item.AC.total }} </span>
          </template>
          <template #[`item.DC`]="{ item }">
            <span> {{ item.DC.pass }} / {{ item.DC.total }} </span>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Home',
  component: {},
  watch: {},
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters(['get_summary'])
  },
  mounted () {
    this.retrieveSummary()
  },
  // When a Vue instance is created, it adds all the properties found in its data object to Vue’s reactivity system.
  // When the values of those properties change, the view will “react”, updating to match the new values.
  data () {
    return {
      isLoading: false,
      headers: [
        { text: 'Message', value: 'name', align: 'start', sortable: true },
        { text: 'CMN', value: 'CMN', sortable: false },
        { text: 'AC', value: 'AC', sortable: false },
        { text: 'DC', value: 'DC', sortable: false }
      ]
    }
  },
  methods: {
    retrieveSummary () {
      this.isLoading = true
      this.act_get_summary()
        .then(() => {
          this.isLoading = false
        })
        .catch((e) => {
          console.log(e)
          this.isLoading = false
        })
    },
    selectMsg (value) {
      var msg_name = value.name.replace('TestCases_SECC_', '')
      this.$router.push({
        name: 'testcase-list',
        query: { msg_type: msg_name }
      })
    },
    ...mapMutations([]),
    ...mapActions([
      'act_get_summary'
    ])
  }
}
</script>

<style>
</style>
