<template>
  <v-row align="start" class="list px-3 mx-auto">
    <v-col cols="12" sm="12">
      <v-card class="mx-auto spacing-playground pa-6" tile>
        <v-card-title>ISO15118-2 Messages </v-card-title>
        <v-data-table
          :headers="headers"
          :items="this.getter_get_summary"
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
import TestcaseDataSerivce from "../services/testcase-data-serivce";
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: "Home",
  component: {},
  watch: {
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      "getter_get_schema",
      "getter_get_summary",
      "getter_get_testcase_list",
      "getter_get_current_execute_tc",
      "getter_get_default_config",
      "getter_get_current_config",
    ]),
  },
  mounted() {
    this.retrieveSummary();
  },
  data() {
    return {
      isLoading: false,
      headers: [
        { text: "Message", value: "name", align: "start", sortable: true },
        { text: "CMN", value: "CMN", sortable: false },
        { text: "AC", value: "AC", sortable: false },
        { text: "DC", value: "DC", sortable: false },
      ],
    };
  },
  methods: {
    retrieveSummary() {
      this.isLoading = true;
      TestcaseDataSerivce.getSummary()
        .then((response) => {
          // this.summary = response.data;
          this.muta_update_summary({summary_info: response.data});
          this.isLoading = false;
        })
        .catch((e) => {
          this.isLoading = false;
          console.log(e);
        });
    },
    selectMsg(value) {
      var msg_name = value.name.replace("TestCases_SECC_", "");
      this.$router.push({ name: "testcase-list", query: { msg_type: msg_name } });
    },
    ...mapMutations([
      'muta_update_summary', // map `this.increment()` to `this.$store.commit('increment')`
      // `mapMutations` also supports payloads:
      'muta_update_testcase_list', // map `this.incrementBy(amount)` to `this.$store.commit('incrementBy', amount)`
      'muta_update_execute_testcase',
      'muta_update_current_cfg',
      'muta_update_default_cfg',
    ]),
  },
};
</script>

<style>
</style>