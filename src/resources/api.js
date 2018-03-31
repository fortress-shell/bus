'use strict';
const axios = require('axios');
const config = require('src/config');
const API_URL = config.get('api:url');
const API_TOKEN = config.get('API_TOKEN');
const TIMEOUT = 1000;
const options = {
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    Authorization: `Bearer token=${API_TOKEN}`
  },
};

module.exports = axios.create(options);
