const axios = require("axios");

/**
 * @description return cep information
 * @returns {Promise}
 */

const cepExtraction = cep => axios.get(`https://viacep.com.br/ws/${cep.toString()}/json/`)

module.exports = cepExtraction;