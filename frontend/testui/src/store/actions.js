import common from './api/ajax';
// import store from '../store';

export default {
    act_get_summary: (context) => {
        return new Promise((resolve, reject) => {
            common.getRequest(
                '/summary/', {},
                function (res) {
                    // store receive summary array to state.summary_info
                    context.commit('muta_update_summary', {
                        summary_info: res.data
                    });
                    resolve(res);
                },
                function (error) {
                    reject(error);
                }
            );
        });
    },
    act_get_testcases: (context, query_params) => {
        return new Promise((resolve, reject) => {
            common.getRequest('/testcases/', query_params,
                function (res) {
                    context.commit('muta_update_testcase_list', {
                        testcase_list: res.data
                    });
                    resolve(res);
                },
                function (error) {
                    reject(error);
                }
            );
        });
    },
    act_get_testcase_name: (context, value) => {
        return new Promise((resolve, reject) => {
            common.getRequest('/testcases/', {name: value},
                function (res) {
                    resolve(res.data);
                },
                function (error) {
                    reject(error);
                }
            );
        });
    },
    act_get_testcase_id: (context, id) => {
        return new Promise((resolve, reject) => {
            common.getRequest(`/testcases/${id}/`, {},
                function (res) {
                    resolve(res.data);
                },
                function (error) {
                    reject(error);
                }
            );
        });
    },
}