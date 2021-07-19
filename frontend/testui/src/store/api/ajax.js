import axios from 'axios'

var SERVER_ADDRESS = process.env.SERVER_ADDRESS
var SERVER_PORT = process.env.SERVER_PORT
var VERSION = process.env.API_VERSION

var SERVER_BASE_URL = 'http://192.168.4.1:8000/api/v1'
if ((SERVER_ADDRESS !== undefined) && (SERVER_PORT !== undefined)) {
  SERVER_BASE_URL = `http://${SERVER_ADDRESS}:${SERVER_PORT}/api/${VERSION}`
}

const config = {
  baseURL: SERVER_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
}
const instance = axios.create(config)

const getRequest = function (url, param, resolve, reject) {
  instance.get(url, { params: param })
    .then(res => {
      resolve(res)
    })
    .catch(error => {
      reject(error)
    })
}

const postRequest = function (url, data, resolve, reject) {
  instance.post(url, data)
    .then(res => {
      resolve(res)
    })
    .catch(error => {
      reject(error)
    })
}

const putRequest = function (url, data, resolve, reject) {
  instance.put(url, data)
    .then(res => {
      resolve(res)
    })
    .catch(error => {
      reject(error)
    })
}

const patchRequest = function (url, data, resolve, reject) {
  instance.patch(url, data)
    .then(res => {
      resolve(res)
    })
    .catch(error => {
      reject(error)
    })
}

const deleteRequest = function (url, resolve, reject) {
  instance.delete(url)
    .then(res => {
      resolve(res)
    })
    .catch(error => {
      reject(error)
    })
}

export default {
  getRequest,
  postRequest,
  putRequest,
  patchRequest,
  deleteRequest
}
