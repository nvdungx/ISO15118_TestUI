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
        <div class="edit-form py-3">
          <p class="headline">
            Testcase Detail
          </p>

          <v-form
            ref="form"
            lazy-validation
          >
            <v-text-field
              v-model.lazy="currentTestcase.name"
              validate-on-blur
              :error-messages="this.validateTestcaseFlag.error_msg"
              label="Testcase"
              rows="1"
              required
              auto-grow
              dense
            />

            <v-textarea
              v-model="currentTestcase.condition"
              :rules="[(v) => !!v || 'Condition is required']"
              label="Condition"
              rows="1"
              required
              auto-grow
              dense
            />

            <v-textarea
              v-model="currentTestcase.expected"
              :rules="[(v) => !!v || 'Expected is required']"
              label="Expected"
              rows="1"
              required
              auto-grow
              dense
            />

            <v-textarea
              v-model="currentTestcase.pics"
              label="Protocol Implementation Conformance Statement"
              rows="1"
              required
              auto-grow
              dense
            />

            <v-textarea
              v-model="currentTestcase.pixit"
              label="Protocol Implementation extra Information for Testing"
              rows="1"
              required
              auto-grow
              dense
            />

            <v-row align="center">
              <v-col
                class="d-flex"
                cols="12"
                sm="6"
              >
                <v-select
                  :items="tetcase_type"
                  :value="currentTestcase.type"
                  label="Type"
                  dense
                />
                <v-select
                  :items="testcase_status"
                  :value="status_map[currentTestcase.status]"
                  label="Result"
                  dense
                />
                <v-select
                  :items="testcase_build"
                  :value="currentTestcase.build_status"
                  label="Build"
                  dense
                />
              </v-col>
            </v-row>

            <v-divider class="my-5" />

            <v-btn
              color="success"
              small
              class="mr-2"
              @click="saveTestcase"
            >
              Save
            </v-btn>
            <v-btn
              color="error"
              small
              class="mr-2"
              @click="close"
            >
              Close
            </v-btn>
          </v-form>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import com_mixin from '../components/shared_mixin'

export default {
  name: 'CreateTestcase',
  component: {},
  mixins: [com_mixin],
  watch: {},
  computed: {
    ...mapGetters([
      'get_testcase_by_name'
    ])
  },
  mounted () {
  },
  created () {
  },
  data () {
    return {
      tetcase_type: ['CMN', 'AC', 'DC'],
      testcase_status: ['none', 'inconclude', 'pass', 'fail', 'error'],
      status_map: {
        n: 'none',
        p: 'pass',
        i: 'inconclude',
        f: 'pass',
        e: 'error'
      },
      testcase_build: ['OK', 'NA'],
      currentTestcase: {
        name: '',
        condition: '',
        expected: '',
        pixit: '',
        pics: '',
        status: '',
        build_status: '',
        type: ''
      },
      validateTestcaseFlag: {
        valid: false,
        new: false,
        error_msg: ''
      }
    }
  },
  methods: {
    checkTestcaseName (value) {
      if (this.currentTestcase !== '' && this.currentTestcase !== null && this.currentTestcase !== undefined) {
        var tc = this.get_testcase_by_name(this.currentTestcase)
        if (undefined !== tc) {
          this.validateTestcaseFlag.valid = true
          this.validateTestcaseFlag.new = false
          this.validateTestcaseFlag.error_msg = ''
          // console.log("valid front");
        } else {
          this.act_get_testcase_name(this.currentTestcase.name)
            .then(() => {
              this.validateTestcaseFlag.valid = true
              this.validateTestcaseFlag.new = false
              this.validateTestcaseFlag.error_msg = ''
              // console.log("valid back");
            })
            .catch(() => {
              if (value.match(/^TC_SECC_(CMN|AC|DC)_VTB_[a-zA-Z]+_\d{3}$/g) != null) {
                this.validateTestcaseFlag.valid = true
                this.validateTestcaseFlag.new = true
                this.validateTestcaseFlag.error_msg = ''
                // console.log("valid back new");
              } else {
                this.validateTestcaseFlag.valid = false
                this.validateTestcaseFlag.error_msg = 'Testcase name is in valid format: TC_SECC_(CMN|AC|DC)_VTB_[a-zA-Z]+_[001-999]'
              }
            })
          return true
        }
      }
    },
    close () {
      this.$router.push({ name: 'Home' })
    },
    saveTestcase () {
      // success create new testcase thne move back home
      this.$router.push({ name: 'Home' })
    },
    ...mapMutations([]),
    ...mapActions([
      'act_get_testcase_name'
    ])
  }
}
</script>

<style>

</style>
