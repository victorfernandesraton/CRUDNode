const axios = require("axios");

/**
 * @description return cep information
 * @returns {{cep: number, logradouro: string,complemento: string, bairro: string,, localidade: string,, uf: string,, ibge: string, gia: string, ddd: number,, siafi: number}}
 */
const getCepInfo = (cep) => {
    return axios.default.get(`viacep.com.br/ws/${cep}/json/`);
};

module.exports - getCepInfo;
