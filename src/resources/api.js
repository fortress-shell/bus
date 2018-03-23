const axios = require('axios');
const config = require('src/config');
const BASE_URL = config.get('BASE_URL');
const API_TOKEN = config.get('API_TOKEN');
const TIMEOUT = 1000;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    Authorization: `Bearer token=${API_TOKEN}`
  },
});

module.exports = api;
