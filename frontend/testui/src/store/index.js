import Vue from 'vue';
import Vuex from 'vuex';
import pics_schema_data from '../assets/pics_schema.json';
import pixit_schema_data from '../assets/pixit_schema.json';
import timer_schema_data from '../assets/timer_schema.json'
import slac_schema_data from '../assets/slac_schema.json';
const defaults = require('json-schema-defaults');

Vue.use(Vuex)
function update_config_prop(input, target) {
  var not_available_list = []
  Object.getOwnPropertyNames(input).forEach(prop => {
    if (Object.prototype.hasOwnProperty.call(target, prop)) {
      target[prop] = input[prop]
    }
    else {
      not_available_list.push(prop);
    }
  });
  if (not_available_list.length > 0) {
    alert(`Error: [${not_available_list.toString()}] is not available in configuration parameter list`);
  }
}
export default new Vuex.Store({
  state: {
    SCHEMA: {
      PICS: pics_schema_data,
      PIXIT: pixit_schema_data,
      TIMER: timer_schema_data,
      SLAC: slac_schema_data
    },
    summary_info: [],
    testcase_list: [],
    default_config: {
      pics: defaults(pics_schema_data),
      pixit: defaults(pixit_schema_data),
      timer: defaults(timer_schema_data),
      slac: defaults(slac_schema_data),
    },
    current_config: {
      pics: defaults(pics_schema_data),
      pixit: defaults(pixit_schema_data),
      timer: defaults(timer_schema_data),
      slac: defaults(slac_schema_data),
    },
    execute_testcase: {
      // id of executing testcase
      id: '',
      // name of executing testcase
      name: '',
      isrunning: false,
      status: 'n',
      build_status: 'NA'
    }
  },
  // synchronous store.commit('increment')
  mutations: {
    mutation_update_summary(state, payload) {
      state.summary_info = Vue.util.extend([], payload.summary_info);
    },
    mutation_update_testcase_list(state, payload) {
      state.testcase_list = Vue.util.extend([], payload.testcase_list);
    },
    mutation_update_execute_testcase(state, payload) {
      if (payload.id) {
        state.execute_testcase.id = payload.id;
      }
      if (payload.name) {
        state.execute_testcase.name = payload.name;
      }
      if (payload.isrunning) {
        state.execute_testcase.isrunning = payload.isrunning;
      }
    },
    mutation_update_current_cfg(state, payload) {
      state.current_config = { ...payload.current_config};
    },
    mutation_update_partial_current_cfg(state, payload) {
      if (payload.pics) {
        update_config_prop(payload.pics, state.current_config.pics);
      }
      if (payload.pixit) {
        update_config_prop(payload.pixit, state.current_config.pixit);
      }
      if (payload.timer) {
        update_config_prop(payload.timer, state.current_config.timer);
      }
      if (payload.slac) {
        update_config_prop(payload.slac, state.current_config.slac);
      }
    },
    mutation_update_default_cfg(state, payload) {
      state.default_config = { ...payload.default_config};
    },
  },
  // asynchronous: commit mutations. store.dispatch('increment')
  // Action handlers receive a context object which exposes the same set of methods/properties on the store instance,
  // so you can call context.commit to commit a mutation, or access the state and getters via context.state and context.getters.
  // We can even call other actions with context.dispatch
  actions: {
    // action_fetch_summary(context, payload) {
    // },
    // action_fetch_testcase_list(context, payload) {
    // },
    // action_dispatch_exec_testcase(context, payload) {
    // }
    action_update_current_tc(context, payload) {
      context.commit('mutation_update_execute_testcase', payload)
    }
  },
  // getter's result is cached based on its dependencies, and will only re-evaluate when some of its dependencies have changed.
  // this.$store.getters.doneTodosCount
  getters: {
    getter_get_schema: (state) => (type) => {
      return state.SCHEMA[type];
    },
    getter_get_summary: (state) => {
      return state.summary_info;
    },
    getter_get_testcase_list: (state) => {
      return state.testcase_list;
    },
    getter_get_current_execute_tc: (state) => {
      return state.execute_testcase;
    },
    getter_get_current_config: (state) => {
      return state.current_config;
    },
    getter_get_default_config: (state) => {
      return state.default_config;
    },
  },
  modules: {
  }
})
