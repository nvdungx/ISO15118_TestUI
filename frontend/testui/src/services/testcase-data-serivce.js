import axios from "axios";

// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFToken";
const http =  axios.create({
    baseURL: "http://localhost:8000/api/v1",
    headers: {
        "Content-type": "application/json"
    }
});

class TestcaseDataSerivce {
  getSummary() {
    return http.get("/summary/");
  }
  // get all testcase
  getAll() {
    return http.get("/testcases/");
  }
  // create new tc
  create(data) {
    return http.post("/testcases/", data);
  }
  // find tc with msg_type
  findByMsgType(msg_type) {
    return http.get(`/testcases/?msg_type=${msg_type}`);
  }
  // find tc with msg_type
  findByName(name) {
    return http.get(`/testcases/?name=${name}`);
  }
  // get specific testcase
  get(id) {
    return http.get(`/testcases/${id}/`);
  }
  // update testcase
  update(id, data) {
    return http.put(`/testcases/${id}/`, data);
  }
  // update testcase
  partial_update(id, data) {
    return http.patch(`/testcases/${id}/`, data);
  }
  // delete specific tc
  delete(id) {
    return http.delete(`/testcases/${id}/`);
  }
  // execute tc
  execute(id, config) {
    return http.put(`/execute/${id}/`, config);
  }
}

export default new TestcaseDataSerivce();