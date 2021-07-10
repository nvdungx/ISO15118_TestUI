import axios from "axios";

// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFToken";
export default axios.create({
    baseURL: "http://localhost:8000/api/v1",
    headers: {
        "Content-type": "application/json"
    }
});
