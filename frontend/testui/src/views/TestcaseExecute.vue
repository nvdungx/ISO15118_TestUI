<template>
  <v-container
    fluid
    class="spacing-playground pa-6"
  >
    <v-row dense>
      <v-col
        class="d-flex align-center"
        cols="12"
        sm="6"
      >
        <v-card
          class="mx-auto pa-4"
          tile
        >
          <v-card-title class="text-lg-h3">
            Configuration
          </v-card-title>
          <v-form
            ref="form"
            lazy-validation
          >
            <v-row dense>
              <v-col cols="2">
                <v-text-field
                  v-model.lazy="target_testcase_id"
                  :rules="[verifyId]"
                  :error-messages="this.err_msg_validate_id"
                  validate-on-blur
                  label="Testcase ID"
                  rows="1"
                  required
                  outlined
                  auto-grow
                  dense
                  loader-height="5"
                  :loading="this.get_current_execute_tc.isrunning? 'green':false"
                  :readonly="this.get_current_execute_tc.isrunning"
                />
              </v-col>
              <v-col cols="10">
                <v-text-field
                  v-model.lazy="target_testcase_name"
                  :rules="[verifyTestcaseName]"
                  :error-messages="this.err_msg_validate_name"
                  validate-on-blur
                  label="Testcase name"
                  rows="1"
                  required
                  outlined
                  auto-grow
                  dense
                  loader-height="5"
                  :loading="this.get_current_execute_tc.isrunning? 'green':false"
                  :readonly="this.get_current_execute_tc.isrunning"
                />
              </v-col>
            </v-row>
          </v-form>
          <v-row
            dense
            align="center"
          >
            <v-card-actions>
              <v-btn
                color="primary"
                @click="resetConfig"
              >
                Default
              </v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-btn
                color="primary"
                @click="storeConfig"
              >
                Save
              </v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-btn
                color="primary"
                :loading="isSelecting"
                @click="onButtonOpen"
              >
                Open
              </v-btn>
              <input
                ref="uploader"
                class="d-none"
                type="file"
                accept="json/*"
                @change="openConfig"
              >
            </v-card-actions>
            <v-card-actions>
              <v-btn
                color="success"
                :disabled="(!this.validExecuteFlag) || !this.valid_testcase"
                @click="executeTestcase"
              >
                Execute
              </v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-btn
                color="orange"
                :disabled="!this.validCancelFlag"
                @click="cancelTestcase"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-row>
          <v-divider class="my-5" />
          <v-row dense>
            <v-col>
              <v-chip
                class="ma-2"
                color="primary"
              >
                Protocol Implementation Conformance Statement (PICS)
              </v-chip>
              <v-form ref="form">
                <v-jsf
                  v-model="configuration.pics"
                  :schema="PICS_SCHEMA"
                />
              </v-form>
              <v-chip
                class="ma-2"
                color="primary"
              >
                V2G Timer
              </v-chip>
              <v-form>
                <v-jsf
                  v-model="configuration.timer"
                  :schema="TIMER_SCHEMA"
                />
              </v-form>
            </v-col>
            <v-col>
              <v-chip
                class="ma-2"
                color="primary"
              >
                Protocol Implementation extra Information for Testing (PIXIT)
              </v-chip>
              <v-form class="">
                <v-jsf
                  v-model="configuration.pixit"
                  :schema="PIXIT_SCHEMA"
                />
              </v-form>
              <v-chip
                class="ma-2"
                color="primary"
              >
                SLAC Parameter
              </v-chip>
              <v-form>
                <v-jsf
                  v-model="configuration.slac"
                  :schema="SLAC_SCHEMA"
                />
              </v-form>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-spacer />
      <v-col
        cols="12"
        sm="6"
      >
        <v-card
          class="mx-auto pa-4"
          tile
        >
          <v-card-title class="text-lg-h3">
            Logging
          </v-card-title>
          <v-card-text> Log return from websocket </v-card-text>
          <v-textarea
            id="textarea_id"
            v-model="this.get_logging_value"
            outlined
            readonly
            dense
            rows="25"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
// import shared method between component
import com_mixin from '../components/shared_mixin'

import Vue from 'vue'

export default {
  name: 'TestcaseExecute',
  components: {},
  // add shared method
  mixins: [com_mixin],
  watch: {
    // update logging_data text area when data change
    '$store.state.logging_data': () => {
      var textarea = document.getElementById('textarea_id')
      textarea.scrollTop = textarea.scrollHeight
    }
  },
  mounted () {
    // call action to check current execution testcase info
    this.act_check_exec_testcase({ id: this.get_current_execute_tc.id, query_params: { action: 'get_info' } })
      .then((response) => {
        // response execute tc info from backend
        this.muta_update_execute_testcase(response.data)
        this.target_testcase_id = this.get_current_execute_tc.id
        this.target_testcase_name = this.get_current_execute_tc.name
        this.valid_testcase = (this.get_current_execute_tc.id !== '') && (this.get_current_execute_tc.name !== '')
      })
      .catch((e) => {
        console.log(e)
      })
    if (this.socket === null) {
      // update socket
      this.socket = this.$store.state.logging_socket
    }
  },
  computed: {
    // mix the getters into computed with object spread operator
    validExecuteFlag: function () {
      return ((this.get_current_execute_tc.isrunning == false) && (this.get_current_execute_tc.id !== '') && (this.get_current_execute_tc.name !== ''))
    },
    validCancelFlag: function () {
      return ((this.get_current_execute_tc.isrunning == true) && (this.get_current_execute_tc.id !== '') && (this.get_current_execute_tc.name !== ''))
    },
    ...mapGetters([
      'get_schema',
      'get_current_execute_tc',
      'get_default_config',
      'get_testcase_by_id',
      'get_testcase_by_name',
      'get_logging_value'
    ])
  },
  updated () {
    if (this.$store.state.default_config === null) {
      // store default config (default config create from schema)
      this.muta_update_default_cfg({ default_config: this.configuration })
    }
  },
  data () {
    return {
      PICS_SCHEMA: this.$store.state.SCHEMA.PICS, // this.get_schema('PICS') cann't call like this because computed not exist yet?
      PIXIT_SCHEMA: this.$store.state.SCHEMA.PIXIT,
      TIMER_SCHEMA: this.$store.state.SCHEMA.TIMER,
      SLAC_SCHEMA: this.$store.state.SCHEMA.SLAC,
      isSelecting: false,
      options: {
        editMode: 'inline'
      },
      configuration: this.$store.state.current_config,
      target_testcase_id: '',
      target_testcase_name: '',
      valid_testcase: false,
      err_msg_validate_name: '',
      err_msg_validate_id: '',
      socket: null
    }
  },
  methods: {
    // load the return data from backend to testcase and change partial of current config
    loadReturnTestcase (testcase) {
      if (this.get_current_execute_tc.isrunning == false) {
        this.target_testcase_id = testcase.id
        this.target_testcase_name = testcase.name
        this.get_current_execute_tc.id = testcase.id
        this.get_current_execute_tc.name = testcase.name
        this.muta_update_partial_current_cfg(this.parseTestcaseConfig(testcase.pics, testcase.pixit))
        this.err_msg_validate_id = ''
        this.err_msg_validate_name = ''
        this.valid_testcase = true
      }
    },
    // verify the testcase if from user input
    verifyId (value) {
      if (value !== '' && value !== null && value !== undefined) {
        // get the testcase from frontend temp data
        var tc = this.get_testcase_by_id(value)
        if (undefined !== tc) {
          // load
          this.loadReturnTestcase(tc)
          return true
        } else {
          // get from backend
          this.act_get_testcase_id(value)
            .then((testcase) => {
              this.loadReturnTestcase(testcase.data)
            })
            .catch(() => {
              this.valid_testcase = false
              this.err_msg_validate_id = 'Testcase ID is not existed'
            })
          return true
        }
      } else {
        this.valid_testcase = false
        return 'Testcase ID is required'
      }
    },
    // verify the testcase name from user input
    verifyTestcaseName (value) {
      if (value !== '' && value !== null && value !== undefined) {
        // get the testcase from frontend temp data
        var tc = this.get_testcase_by_name(value)
        if (undefined !== tc) {
          // load
          this.loadReturnTestcase(tc)
          return true
        } else {
          // get the testcase from backend
          this.act_get_testcase_name(value)
            .then((testcase) => {
              this.loadReturnTestcase(testcase)
            })
            .catch(() => {
              this.valid_testcase = false
              this.err_msg_validate_name = 'Testcase name is not existed'
            })
          return true
        }
      } else {
        this.valid_testcase = false
        return 'Testcase name is required'
      }
    },
    //  v-jsf @change="logEvent('slac', $event)"
    // logEvent(key, $event) {
    //   console.log('vjsf event', key, $event)
    // },
    // store config to json file
    storeConfig () {
      var config = this.getConfigInt(this.configuration, this.$store.state.SCHEMA)
      const data = JSON.stringify(config, null, 4)
      const blob = new Blob([data], { type: 'text/plain' })
      const e = document.createEvent('MouseEvents'); const a = document.createElement('a')
      a.download = 'testconfig.json'
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
    },
    // open windows event
    onButtonOpen () {
      this.isSelecting = true
      window.addEventListener(
        'focus',
        () => {
          this.isSelecting = false
        },
        { once: true }
      )
      this.$refs.uploader.click()
    },
    // load the config json file from user selection
    openConfig (e) {
      var selectedFile = e.target.files[0]
      if (!selectedFile) {
        console.log('invalid file')
        return
      }
      var reader = new FileReader()
      reader.readAsText(selectedFile, 'UTF-8')
      reader.onload = (evt) => {
        // json should follow the schema
        var result_json = JSON.parse(evt.target.result)
        // TODO: need check the input json here
        this.configuration = Vue.util.extend({}, result_json)
      }
      reader.onerror = (evt) => {
        console.error(evt)
      }
      e.target.value = null
    },
    // reset current page configuation to default
    resetConfig () {
      this.configuration = Vue.util.extend({}, this.get_default_config)
    },
    // execute current input testcase
    executeTestcase () {
      if (this.get_current_execute_tc.isrunning == false) {
        this.muta_update_execute_testcase({ id: this.target_testcase_id, name: this.target_testcase_name, isrunning: true })
        var config = this.getConfigInt(this.configuration, this.$store.state.SCHEMA)
        this.act_execute_testcase({ id: this.get_current_execute_tc.id, config: config })
          .then((response) => {
            console.log(response.data)
          })
          .catch((e) => {
            console.log(e)
          })
      } else {
        alert(`Testcase ${this.get_current_execute_tc.name} is already in execution`)
      }
    },
    cancelTestcase () {
      if (this.get_current_execute_tc.isrunning == true) {
        this.act_check_exec_testcase({ id: this.target_testcase_id, query_params: { action: 'cancel' } })
          .then((response) => {
            this.muta_update_execute_testcase({ id: '', name: '', isrunning: false })
            this.verifyId(this.target_testcase_id)
            console.log(response.data)
          })
          .catch((e) => {
            console.log(e)
          })
      }
    },
    ...mapActions([
      'act_get_testcase_id',
      'act_get_testcase_name',
      'act_execute_testcase',
      'act_check_exec_testcase'
    ]),
    ...mapMutations([
      'muta_update_execute_testcase',
      'muta_update_partial_current_cfg',
      'muta_update_default_cfg'
    ])
  }
}
</script>

<style>
</style>
