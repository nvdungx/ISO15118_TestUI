import Vue from 'vue';
import Vuex from 'vuex';
import pics_schema_data from '../assets/pics_schema.json';
import pixit_schema_data from '../assets/pixit_schema.json';
import timer_schema_data from '../assets/timer_schema.json'
import slac_schema_data from '../assets/slac_schema.json';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import socket from '../services/logging_socket'

const defaults = require('json-schema-defaults');

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // default schema for configuration parameters
    SCHEMA: {
      PICS: pics_schema_data,
      PIXIT: pixit_schema_data,
      TIMER: timer_schema_data,
      SLAC: slac_schema_data
    },
    // summary info on v2g message testcases
    summary_info: [],
    // list of testcases
    testcase_list: [],
    // default configuration
    default_config: {
      pics: defaults(pics_schema_data),
      pixit: defaults(pixit_schema_data),
      timer: defaults(timer_schema_data),
      slac: defaults(slac_schema_data),
    },
    // configuration after user modify
    current_config: {
      pics: defaults(pics_schema_data),
      pixit: defaults(pixit_schema_data),
      timer: defaults(timer_schema_data),
      slac: defaults(slac_schema_data),
    },
    // target testcase to execute
    execute_testcase: {
      // id of executing testcase
      id: '',
      // name of executing testcase
      name: '',
      isrunning: false,
      status: 'n',
      build_status: 'NA',
      pics: {},
      pixit: {},
    },
    logging_socket: socket,
  },
  // getter's result is cached based on its dependencies, and will only re-evaluate when some of its dependencies have changed.
  // this.$store.getters.doneTodosCount
  getters,
  // synchronous store.commit('increment')
  mutations,
  // asynchronous: commit mutations. store.dispatch('increment')
  // Action handlers receive a context object which exposes the same set of methods/properties on the store instance,
  // so you can call context.commit to commit a mutation, or access the state and getters via context.state and context.getters.
  // We can even call other actions with context.dispatch
  actions,
  modules: {
  }
})
