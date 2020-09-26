document.getElementById("telefone").addEventListener("input", (e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    const matchPattern = /(\d{0,2})(\d{0,1})(\d{0,4})(\d{0,4})/;
    const x = onlyNumbers.match(matchPattern);
    e.target.value = `(${x[1]}) ${x[2]} ${x[3]}-${x[4]}`;
});

// auxiiar de delete
document.getElementById("telefone").addEventListener('keydown', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '')
})