<template>
  <v-container fluid class="spacing-playground pa-6">
    <v-row dense>
      <v-col class="d-flex align-center" cols="auto" sm="6">
        <v-card class="mx-auto pa-4" tile>
          <v-card-title class="text-lg-h3">Configuration</v-card-title>
          <v-form ref="form" lazy-validation>
            <v-row dense>
              <v-col cols="2">
                <v-text-field
                  v-model="target_testcase.id"
                  :rules="[(v) => !!v || 'Testcase ID is required']"
                  label="Testcase ID"
                  rows="1"
                  required outlined auto-grow dense
                  loader-height=5
                  :loading="this.getter_get_current_execute_tc.isrunning? 'green':false"
                  :readonly="this.getter_get_current_execute_tc.isrunning"
                ></v-text-field>
              </v-col>
              <v-col cols="10">
                <v-text-field
                  v-model="target_testcase.name"
                  :rules="[(v) => !!v || 'Testcase name is required']"
                  label="Testcase name"
                  rows="1"
                  required outlined auto-grow dense
                  loader-height=5
                  :loading="this.getter_get_current_execute_tc.isrunning? 'green':false"
                  :readonly="this.getter_get_current_execute_tc.isrunning"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <v-row dense align="center">
            <v-card-actions>
              <v-btn color="primary" @click="resetConfig">Default</v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-btn color="primary" @click="storeConfig">Save</v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-btn color="primary" :loading="isSelecting" @click="onButtonOpen" >Open</v-btn>
              <input ref="uploader" class="d-none" type="file" accept="json/*" @change="openConfig" />
            </v-card-actions>
            <v-card-actions>
              <v-btn color="success"
              :disabled="this.getter_get_current_execute_tc.isrunning"
              @click="executeTestcase">Execute</v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-btn color="orange"
              :disabled="!this.getter_get_current_execute_tc.isrunning"
              @click="cancelTestcase">Cancel</v-btn>
            </v-card-actions>
          </v-row>
          <v-divider class="my-5"></v-divider>
          <v-row dense>
            <v-col>
              <v-chip class="ma-2" color="primary">Protocol Implementation Conformance Statement (PICS)</v-chip>
              <v-form ref="form">
                <v-jsf v-model="configuration.pics" :schema="PICS_SCHEMA" />
              </v-form>
              <v-chip class="ma-2" color="primary">V2G Timer</v-chip>
              <v-form>
                <v-jsf v-model="configuration.timer" :schema="TIMER_SCHEMA" />
              </v-form>
            </v-col>
            <v-col>
              <v-chip class="ma-2" color="primary">Protocol Implementation extra Information for Testing (PIXIT)</v-chip>
              <v-form class="">
                <v-jsf v-model="configuration.pixit" :schema="PIXIT_SCHEMA" />
              </v-form>
              <v-chip class="ma-2" color="primary">SLAC Parameter</v-chip>
              <v-form>
                <v-jsf v-model="configuration.slac" :schema="SLAC_SCHEMA" />
              </v-form>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto" sm="6">
        <v-card class="mx-auto pa-4" tile>
          <v-card-title class="text-lg-h3"> Logging </v-card-title>
          <v-card-text> Log return from websocket </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TestcaseDataSerivce from "../services/testcase-data-serivce";
import { mapGetters, mapMutations, mapActions } from "vuex";

import Vue from "vue";

export default {
  name: "TestcaseExecute",
  components: {},
  watch: {
    // watch change
    // 'configuration.pics': function () {
    //   console.log(this.configuration.pics);
    //   console.log(this.getter_get_current_config.pics);
    // },
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
  beforeCreate() {
    //console.log("before created");
  },
  created() {
    // console.log("created");
  },
  beforeMount() {
    // console.log("before mount");
  },
  mounted() {
    // console.log("mounted");
  },
  updated() {
    // console.log("update");
    if (this.$store.state.default_config === null) {
        // store default config (default config create from schema)
        this.muta_update_default_cfg({default_config: this.configuration});
    }
  },
  data() {
    return {
      PICS_SCHEMA: this.$store.state.SCHEMA.PICS, // this.getter_get_schema('PICS') cann't call like this because computed not exist yet?
      PIXIT_SCHEMA: this.$store.state.SCHEMA.PIXIT,
      TIMER_SCHEMA: this.$store.state.SCHEMA.TIMER,
      SLAC_SCHEMA: this.$store.state.SCHEMA.SLAC,
      isSelecting: false,
      options: {
        editMode: "inline",
      },
      configuration: this.$store.state.current_config,
      target_testcase: this.$store.state.execute_testcase,
    };
  },
  methods: {
    verify_id(id) {
      console.log(id);
    },
    verify_testcase_name(name) {
      console.log(name);
    },
    //  v-jsf @change="logEvent('slac', $event)"
    // logEvent(key, $event) {
    //   console.log('vjsf event', key, $event)
    // },
    storeConfig() {
      const data = JSON.stringify(this.configuration, null, 4);
      const blob = new Blob([data], { type: "text/plain" });
      const e = document.createEvent("MouseEvents"), a = document.createElement("a");
      a.download = "config.json";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },
    onButtonOpen() {
      this.isSelecting = true;
      window.addEventListener(
        "focus",
        () => {
          this.isSelecting = false;
        },
        { once: true }
      );
      this.$refs.uploader.click();
    },
    openConfig(e) {
      var selectedFile = e.target.files[0];
      if (!selectedFile) {
        console.log("invalid file");
        return;
      }
      var reader = new FileReader();
      reader.readAsText(selectedFile, "UTF-8");
      reader.onload = (evt) => {
        var result_json = JSON.parse(evt.target.result);
        this.configuration = Vue.util.extend({}, result_json);
      };
      reader.onerror = (evt) => {
        console.error(evt);
      };
      e.target.value = null;
    },
    resetConfig() {
      this.configuration = Vue.util.extend({}, this.getter_get_default_config);
    },
    executeTestcase() {
      this.muta_update_execute_testcase({id: this.target_testcase.id, name: this.target_testcase.name, isrunning: true});
      TestcaseDataSerivce.execute(this.getter_get_current_execute_tc.id, this.configuration)
        .then((response) => {
          console.log(response);
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    cancelTestcase() {
      TestcaseDataSerivce.execute(this.target_testcase.id, {cancel: true})
        .then((response) => {
          this.muta_update_execute_testcase({id: '', name: '', isrunning: false});
          console.log(response);
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    ...mapActions([
      'action_update_current_tc'
    ]),
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