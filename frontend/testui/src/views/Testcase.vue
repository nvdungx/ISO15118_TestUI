<template>
<v-row align="start" class="list px-3 mx-auto">
  <v-col cols="12" sm="12">
      <v-card class="mx-auto spacing-playground pa-6" tile>
          <div v-if="currentTestcase" class="edit-form py-3">
            <p class="headline">Testcase Detail</p>

            <v-form ref="form" lazy-validation>
              <v-text-field
                v-model.lazy="currentTestcase.name"
                validate-on-blur
                readonly
                :error-messages="this.validateTestcaseFlag.error_msg"
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
import { mapMutations, mapGetters, mapActions } from 'vuex';
import com_mixin from "../components/shared_mixin";

export default {
  name: "TestcaseDetail",
  component: {},
  mixins: [com_mixin],
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
      "get_current_execute_tc",
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
      validateTestcaseFlag: {
        valid: false,
        new: false,
        error_msg: ""
      }
    };
  },
  methods: {
    getTestcase(id) {
      this.act_get_testcase_id(id)
        .then((response) => {
          this.currentTestcase = response;
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
      if (this.get_current_execute_tc.isrunning === false) {
          this.muta_update_execute_testcase({id: this.currentTestcase.id, name: this.currentTestcase.name, isrunning: true})
        // parse config pics, pixit string and update config data
        this.muta_update_partial_current_cfg(this.parseTestcaseConfig(this.currentTestcase.pics, this.currentTestcase.pixit));
        var config = this.getConfigInt(this.get_current_config, this.$store.state.SCHEMA)
        this.act_execute_testcase({id:this.get_current_execute_tc.id, config:config})
          .then((response) => {
            if (response.status === 200) {
              // trigger websocket to monitoring execution
              console.log(`execute testcase`);
            }
          })
          .catch((e) => {
            console.log(e);
          });
        }
        else {
          alert(`Testcase ${this.get_current_execute_tc.name} is in execution`);
        }
    },
    showTestcaseLogs() {

    },
    updateTestcase() {
      this.act_update_testcase({id:this.currentTestcase.id, data:this.currentTestcase})
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
    },
    deleteTestcase() {
      this.act_remove_testcase_id(this.currentTestcase.id)
        .then((response) => {
          if (response.status === 200) {
            this.$router.push({ name: "Home" });
          }
          else {
            alert(`Status code not 200 - ${response}`);
          }
        })
        .catch((e) => {
          alert(`Failed to delete testcase ${e.response}`);
        });
    },
    ...mapMutations([
      'muta_update_execute_testcase',
      'muta_update_partial_current_cfg',
    ]),
    ...mapActions([
      'act_update_testcase',
      'act_get_testcase_id',
      'act_remove_testcase_id',
      'act_execute_testcase'
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