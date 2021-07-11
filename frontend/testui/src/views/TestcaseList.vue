<template>
  <v-row align="start" class="list px-3 mx-auto">
    <v-col cols="12" sm="12">
      <v-card class="mx-auto spacing-playground pa-6" tile>
        <v-card-title>ISO15118-4 Conformance Testcases
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="this.getter_get_testcase_list"
          :search="search"
          :loading="isLoading"
          loading-text="Loading... Please wait"
          :hide-default-footer=true
        >
          <template v-slot:top="{ pagination, options, updateOptions }">
            <v-data-footer
              :pagination="pagination"
              :options="options"
              @update:options="updateOptions"
              items-per-page-text="$vuetify.dataTable.itemsPerPageText"/>
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <v-chip :color="getColor(item.status)" dark> {{ status_map[item.status] }}</v-chip>
          </template>
          <template v-slot:[`item.build_status`]="{ item }">
            <v-chip :color="getColor(item.build_status)" dark> {{ item.build_status }}</v-chip>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon large 
              :color=isExecuted(item.id)
              @click="executeTestcase(item)">mdi-motion-play</v-icon>
            <v-icon large color="blue-grey" @click="editTestcase(item.id)">mdi-pencil</v-icon>
            <v-icon large color="deep-orange" @click="deleteTestcase(item.id)">mdi-delete</v-icon>
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
  name: "TestcaseList",
  components: {},
  watch: {
    '$route.params': 'refreshList'
  },
  mounted() {
  },
  created() {
    this.refreshList();
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
  data() {
    return {
      isLoading: false,
      search: '',
      status_map: {
        "n" : "none",
        "p" : "pass",
        "i" : "inconclude",
        "f" : "pass",
        "e" : "error"
      },
      headers: [
        { text: "Testcase", value: "name", align: "start", sortable: true, filterable: true },
        { text: "Condition", value: "condition", sortable: false },
        { text: "Expected", value: "expected", sortable: false },
        { text: "PICS", value: "pics", sortable: false },
        { text: "PIXIT", value: "pixit", sortable: false },
        { text: "Status", value: "status", sortable: false },
        { text: "Build", value: "build_status", sortable: false },
        { text: "Actions", value: "actions", sortable: false},
      ],
    };
  },
  methods: {
    isExecuted(id) {
      if ((id === this.getter_get_current_execute_tc.id) && (this.getter_get_current_execute_tc.isrunning)) {
        return 'green';
      }
      else {
        return 'gray';
      }
    },
    getColor (result) {
      if (result.toLocaleUpperCase() === 'P') return 'green'
      else if (result.toLocaleUpperCase() === 'N') return 'gray'
      else if (result.toLocaleUpperCase() === 'I') return 'orange'
      else if (result.toLocaleUpperCase() === 'OK') return 'green'
      else if (result.toLocaleUpperCase() === 'NA') return 'gray'
      else return 'red'
    },
    filterText (value, search) {
      return value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toString().toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) !== -1
    },
    refreshList() {
      this.isLoading = true;
      // check route push has query param msg_type
      if (this.$route.query.msg_type) {
        // trigger get find by name
        TestcaseDataSerivce.findByMsgType(this.$route.query.msg_type)
          .then((response) => {
            this.muta_update_testcase_list({testcase_list: response.data});
            this.isLoading = false;
          })
          .catch((e) => {
            console.log(e.response);
            this.isLoading = false;
          });
      }
      else {
        // get all testcase
        TestcaseDataSerivce.getAll()
          .then((response) => {
            this.muta_update_testcase_list({testcase_list: response.data});
            this.isLoading = false;
          })
          .catch((e) => {
            console.log(e.response);
            this.isLoading = false;
          });
      }
    },
    editTestcase(id) {
      this.$router.push({ name: "testcase-detail", params: { id: id } });
    },
    deleteTestcase(id) {
      console.log(`delete testcase id ${id}`);
      // TestcaseDataSerivce.delete(id)
      //   .then((response) => {
      //     this.refreshList();
      //   })
      //   .catch((e) => {
      //     console.log(e.response);
      //   });
    },
    executeTestcase(testcase) {
      // testcase object
      // build_status: (...)
      // condition: (...)
      // expected: (...)
      // id: (...)
      // name: (...)
      // path: (...)
      // pics: (...)
      // pixit: (...)
      // status: (...)
      // type: (...)
      // check no testcase running then update data and execute
      if (this.getter_get_current_execute_tc.isrunning == false) {
        this.muta_update_execute_testcase({id: testcase.id, name: testcase.name, isrunning: true})
        // parse config pics, pixit string and update config data
        var config_json = ['', ''];
        [testcase.pics, testcase.pixit].forEach((config, index) =>{
          config_json[index] = "{";
          // replace all \n and split by ,
          config.replaceAll(/\n/g, '').split(",").forEach(element => {
            // split key and value
            var items = element.split("=");
            // if not empty
            if (items.length > 1) {
              config_json[index] += `"${items[0].trim()}":"${items[1].trim()}",`;
            }
          });
          if (config_json[index].length > 1) {
            config_json[index] = config_json[index].slice(0, -1) + "}";
          }
          else {
            config_json[index] += "}";
          }
          config_json[index] = JSON.parse(config_json[index]);
        });
        // call mutation to update current config with testcase specific
        this.muta_update_partial_current_cfg({pics: config_json[0], pixit: config_json[1]})
        TestcaseDataSerivce.execute(testcase.id, this.getter_get_current_config)
          .then((response) => {
            console.log(response);
            // trigger websocket to monitoring execution
          })
          .catch((e) => {
            console.log(e.response);
          });
      }
    },
    ...mapMutations([
      'muta_update_summary', // map `this.increment()` to `this.$store.commit('increment')`
      // `mapMutations` also supports payloads:
      'muta_update_testcase_list', // map `this.incrementBy(amount)` to `this.$store.commit('incrementBy', amount)`
      'muta_update_execute_testcase',
      'muta_update_current_cfg',
      'muta_update_default_cfg',
      'muta_update_partial_current_cfg',
    ]),
  },
  // beforeRouteEnter(to, from, next) {
  //   // called before the route that renders this component is confirmed.
  //   // does NOT have access to `this` component instance,
  //   // because it has not been created yet when this guard is called!
  //   console.log([to, from, next]);
  // },
  // beforeRouteUpdate(to, from, next) {
  //  // called when the route that renders this component has changed.
  //  // This component being reused (by using an explicit `key`) in the new route or not doesn't change anything.
  //  // For example, for a route with dynamic params `/foo/:id`, when we
  //  // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
  //  // will be reused (unless you provided a `key` to `<router-view>`), and this hook will be called when that happens.
  //  // has access to `this` component instance.
  // },
  // beforeRouteLeave(to, from, next) {
  //   // called when the route that renders this component is about to
  //   // be navigated away from.
  //   // has access to `this` component instance.
  // }
};
</script>

<style>
</style>