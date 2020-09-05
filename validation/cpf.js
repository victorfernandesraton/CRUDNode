const cpf = /^\d{3}\d{3}\d{3}\d{2}$/;

module.exports = (v) => cpf.test(v.replace('[^0-9\s.]+|\.(?!\D)', ''))