export default {
    get_schema: (state) => (type) => {
        return state.SCHEMA[type];
    },
    get_summary: (state) => {
        return state.summary_info;
    },
    get_testcase_list: (state) => {
        return state.testcase_list;
    },
    get_testcase_by_id: (state) => (id) => {
        return state.testcase_list.find(testcase => testcase.id === id);
    },
    get_testcase_by_name: (state) => (name) => {
        // return undefined if not found
        return state.testcase_list.find(testcase => testcase.name === name);
    },
    get_current_execute_tc: (state) => {
        return state.execute_testcase;
    },
    get_current_config: (state) => {
        return state.current_config;
    },
    get_default_config: (state) => {
        return state.default_config;
    },
}