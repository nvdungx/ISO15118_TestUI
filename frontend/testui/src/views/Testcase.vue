<template>
<v-row align="start" class="list px-3 mx-auto">
  <v-col cols="12" sm="12">
      <v-card class="mx-auto spacing-playground pa-6" tile>
          <div v-if="currentTestcase" class="edit-form py-3">
            <p class="headline">Testcase Detail</p>

            <v-form ref="form" lazy-validation>
              <v-text-field
                v-model="currentTestcase.name"
                :rules="[(v) => !!v || 'Title is required']"
                label="Testcase"
                rows="1"
                required
                auto-grow
                dense
              ></v-text-field>

              <v-textarea
                v-model="currentTestcase.condition"
                :rules="[(v) => !!v || 'Condition is required']"
                label="Condition"
                rows="1"
                required
                auto-grow
                dense
              ></v-textarea>

              <v-textarea
                v-model="currentTestcase.expected"
                :rules="[(v) => !!v || 'Expected is required']"
                label="Expected"
                rows="1"
                required
                auto-grow
                dense
              ></v-textarea>

              <v-textarea
                v-model="currentTestcase.pics"
                label="Protocol Implementation Conformance Statement"
                rows="1"
                required
                auto-grow
                dense
              ></v-textarea>

              <v-textarea
                v-model="currentTestcase.pixit"
                label="Protocol Implementation extra Information for Testing"
                rows="1"
                required
                auto-grow
                dense
              ></v-textarea>

              <v-row align="center">
                <v-col class="d-flex" cols="12" sm="6">
                  <v-select
                    :items="tetcase_type"
                    :value="currentTestcase.type"
                    label="Type"
                    dense
                  ></v-select>
                  <v-select
                    :items="testcase_status"
                    :value="status_map[currentTestcase.status]"
                    label="Result"
                    dense
                  ></v-select>
                  <v-select
                    :items="testcase_build"
                    :value="currentTestcase.build_status"
                    label="Build"
                    dense
                  ></v-select>
                </v-col>
              </v-row>

              <v-divider class="my-5"></v-divider>

              <v-btn color="primary" small class="mr-2" @click="executeTestcase" > Execute </v-btn>

              <v-btn color="primary" small class="mr-2" @click="showTestcaseLogs" > ViewLogs </v-btn>

              <v-btn color="success" small class="mr-2" @click="updateTestcase"> Update </v-btn>

              <v-btn color="error" small class="mr-2" @click="deleteTestcase"> Delete </v-btn>
            </v-form>
          </div>

          <div v-else>
            <p class="mt-3">Testcase is not exist ...</p>
          </div>
      </v-card>
  </v-col>
</v-row>
</template>

<script>
import TestcaseDataSerivce from "../services/testcase-data-serivce";
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: "TestcaseDetail",
  component: {},
  watch: {
    '$route.params': function () {
      this.getTestcase(this.$route.params.id);
    },
  },
  mounted() {
    this.getTestcase(this.$route.params.id);
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      "get_schema",
      "get_summary",
      "get_testcase_list",
      "get_current_execute_tc",
      "get_default_config",
      "get_current_config",
    ]),
  },
  data() {
    return {
      tetcase_type: ['CMN', 'AC', 'DC'],
      testcase_status: ['none', 'inconclude', 'pass', 'fail', 'error'],
      status_map: {
        "n" : "none",
        "p" : "pass",
        "i" : "inconclude",
        "f" : "pass",
        "e" : "error"
      },
      testcase_build: ['OK', 'NA'],
      currentTestcase: null,
    };
  },
  methods: {
    getTestcase(id) {
      TestcaseDataSerivce.get(id)
        .then((response) => {
          this.currentTestcase = response.data;
          this.currentTestcase.condition = this.currentTestcase.condition.replace(/\n/g, ' ');
          this.currentTestcase.expected = this.currentTestcase.expected.replace(/\n/g, ' ');
          this.currentTestcase.pics = this.currentTestcase.pics.replace(/\n/g, ' ');
          this.currentTestcase.pixit = this.currentTestcase.pixit.replace(/\n/g, ' ');
        })
        .catch((e) => {
          this.currentTestcase = null;
          console.log(e.response);
        });
    },
    executeTestcase() {
      var data = JSON.stringify(this.currentTestcase);
      TestcaseDataSerivce.execute(this.currentTestcase.id, data)
        .then(() => {
          // trigger websocket to monitoring execution
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    showTestcaseLogs() {

    },
    updateTestcase() {
      // if testcase name is changed -> check and create new testcase
      // TestcaseDataSerivce.update(this.currentTestcase.id, this.currentTestcase)
      //   .then((response) => {
      //     console.log(response.data);
      //   })
      //   .catch((e) => {
      //     console.log(e.response);
      //   });
    },
    deleteTestcase() {
      console.log(`delete testcase ${this.currentTestcase.id}`);
      this.$router.push({ name: "Home" });
      // TestcaseDataSerivce.delete(this.currentTestcase.id)
      //   .then((response) => {
      //     this.$router.push({ name: "Home" });
      //   })
      //   .catch((e) => {
      //     console.log(e.response);
      //   });
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
.edit-form {
  /* max-width: 300px; */
  margin: auto;
}
</style>