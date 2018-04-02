'use strict';
const axios = require('axios');
const config = require('src/config');
const API_URL = config.get('api:url');
const TIMEOUT = config.get('api:timeout');
const options = {
  baseURL: API_URL,
  timeout: TIMEOUT,
};

module.exports = axios.create(options);
