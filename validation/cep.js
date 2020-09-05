module.exports = (cep) => {
    const cepRx = /^[0-9]{8}$/g;
    const x = cep.replace('/\D/g', '');
    return cepRx.test(x);
}
