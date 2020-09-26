const cnpj = /^\d{2}\d{3}\d{3}\d{4}\d{2}$/;

module.exports = (v) => cnpj.test(v.replace(/\D+/g, ''))