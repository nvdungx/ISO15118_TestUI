import common from './api/ajax'
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
          })
          resolve(res)
        },
        function (error) {
          reject(error)
        }
      )
    })
  },
  act_get_testcases: (context, query_params) => {
    return new Promise((resolve, reject) => {
      // get testcase list, filter by query_params {msg_type: value} or empty {}
      common.getRequest('/testcases/', query_params,
        function (res) {
          context.commit('muta_update_testcase_list', {
            testcase_list: res.data
          })
          resolve(res)
        },
        function (error) {
          reject(error)
        }
      )
    })
  },
  act_get_testcase_name: (context, value) => {
    return new Promise((resolve, reject) => {
      // get testcase by name field
      common.getRequest('/testcases/', { name: value },
        function (res) {
          resolve(res.data)
        },
        function (error) {
          reject(error)
        }
      )
    })
  },
  act_get_testcase_id: (context, id) => {
    // get testcase by id
    return new Promise((resolve, reject) => {
      common.getRequest(`/testcases/${id}/`, {},
        function (res) {
          resolve(res)
        },
        function (error) {
          reject(error)
        }
      )
    })
  },
  act_remove_testcase_id: (context, id) => {
    // get testcase by id
    return new Promise((resolve, reject) => {
      common.deleteRequest(`/testcases/${id}/`,
        function (res) {
          resolve(res)
        },
        function (error) {
          reject(error)
        }
      )
    })
  },
  act_update_testcase: (context, { id, data }) => {
    // get testcase by id
    return new Promise((resolve, reject) => {
      common.putRequest(`/testcases/${id}/`, data,
        function (res) {
          resolve(res)
        },
        function (error) {
          reject(error)
        }
      )
    })
  },
  act_create_testcase: (context, data) => {
    // get testcase by id
    return new Promise((resolve, reject) => {
      common.postRequest('/testcases/', data,
        function (res) {
          resolve(res)
        },
        function (error) {
          reject(error)
        }
      )
    })
  },
  act_execute_testcase: (context, { id, config }) => {
    // get testcase by id
    return new Promise((resolve, reject) => {
      common.putRequest(`/execute/${id}/`, config,
        function (res) {
          resolve(res)
        },
        function (error) {
          reject(error)
        }
      )
    })
  },
  act_check_exec_testcase: (context, { id, query_params }) => {
    // get current execution testcase
    // "action": ["get_info", "cancel"]
    if (id === null || id === '') {
      id = '0'
    }
    return new Promise((resolve, reject) => {
      common.getRequest(`/execute/${id}/`, query_params,
        function (res) {
          resolve(res)
        },
        function (error) {
          reject(error)
        }
      )
    })
  }
}
