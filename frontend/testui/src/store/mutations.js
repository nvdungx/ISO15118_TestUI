import Vue from 'vue';

function update_config_prop(input, target) {
    var not_available_list = []
    Object.getOwnPropertyNames(input).forEach(prop => {
        if (Object.prototype.hasOwnProperty.call(target, prop)) {
            target[prop] = input[prop]
        } else {
            not_available_list.push(prop);
        }
    });
    if (not_available_list.length > 0) {
        alert(`Error: [${not_available_list.toString()}] is not available in configuration parameter list`);
    }
}

export default {
    muta_update_summary(state, payload) {
        state.summary_info = Vue.util.extend([], payload.summary_info);
    },
    muta_update_testcase_list(state, payload) {
        state.testcase_list = Vue.util.extend([], payload.testcase_list);
    },
    muta_update_execute_testcase(state, payload) {
        if (payload.id !== undefined) {
            state.execute_testcase.id = payload.id;
        }
        if (payload.name !== undefined) {
            state.execute_testcase.name = payload.name;
        }
        if (payload.isrunning !== undefined) {
            state.execute_testcase.isrunning = payload.isrunning;
        }
    },
    muta_update_current_cfg(state, payload) {
        if (payload.current_config !== undefined)
            state.current_config = {
                ...payload.current_config
            };
    },
    muta_update_partial_current_cfg(state, payload) {
        if (payload.pics !== undefined) {
            update_config_prop(payload.pics, state.current_config.pics);
        }
        if (payload.pixit !== undefined) {
            update_config_prop(payload.pixit, state.current_config.pixit);
        }
        if (payload.timer !== undefined) {
            update_config_prop(payload.timer, state.current_config.timer);
        }
        if (payload.slac !== undefined) {
            update_config_prop(payload.slac, state.current_config.slac);
        }
    },
    muta_update_default_cfg(state, payload) {
        state.default_config = {
            ...payload.default_config
        };
    },
}