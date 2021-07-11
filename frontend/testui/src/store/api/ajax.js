import axios from 'axios';
import dotenv from 'dotenv'

const result = dotenv.config();

var SERVER_ADDRESS = process.env.SERVER_ADDRESS;
var SERVER_PORT = process.env.SERVER_PORT;
var VERSION = process.env.API_VERSION;
console.log(SERVER_ADDRESS, SERVER_PORT);

var SERVER_BASE_URL = "http://127.0.0.1:8000";

if ((SERVER_ADDRESS !== null) && (SERVER_PORT !== null)) {
  SERVER_BASE_URL = `http://${SERVER_ADDRESS}:${SERVER_PORT}/api/${VERSION}`;
}
const config = {
  baseURL: SERVER_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
}
const instance = axios.create(config)

const getRequest = function (url, data, resolve, reject) {
  instance.get(url, data)
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

const deleteRequest = function(url, data, resolve, reject) {
  instance.delete(url, data)
    .then(res => {
      resolve(res);
    })
    .catch(error => {
      reject(error);
    });
};

const putRequest = function (url, data, resolve, reject) {
  instance.put(url, data)
    .then(res => {
      resolve(res)
    })
    .catch(error => {
      reject(error)
    })
};

const patchRequest = function (url, data, resolve, reject) {
  instance.patch(url, data)
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
  deleteRequest,
  putRequest,
  patchRequest,
}
