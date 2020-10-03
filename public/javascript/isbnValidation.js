const validateIsbn = (payload) => {
    // Checks for ISBN-10 or ISBN-13 format
    const regex = /^(?:\d{9}[\dXx]|\d{13})$/;
    let isbn = payload.replace(/^ISBN(?:-1[03])?:?\x20+/i, "");
    if (regex.test(isbn)) {
        console.log('here')
        isbn = isbn.toString();

        //Remove last digit (control digit):
        let number = isbn.slice(0, -1);

        //Convert number to array (with only digits):
        number = number.split("").map(Number);

        //Save last digit (control digit):
        const last = isbn.slice(-1);
        const lastDigit = last !== "X" ? parseInt(last, 10) : "X";

        //Algorithm for checksum calculation (digit * position):
        number = number.map((digit, index) => {
            return digit * (index + 1);
        });

        //Calculate checksum from array:
        const sum = number.reduce((a, b) => a + b, 0);

        //Validate control digit:
        const controlDigit = sum % 11;
        return lastDigit === (controlDigit !== 10 ? controlDigit : "X");
    }
    return false;
};
// Mensagen de erro para isbn code
const errorMesssage = document.getElementById("isbn-error");
errorMesssage.addEventListener("change", (e) => {
    errorMesssage.hidden = errorMesssage?.outerHTML?.length > 0;
});

document.getElementById("isbn").addEventListener("keyup", (e) => {
    console.log(validateIsbn(e.target.value));
    if (!validateIsbn(e.target.value)) {
        errorMesssage.value = "Código inválid";
        console.log(false);
    } else {
        errorMesssage.value = "";
        console.log(true);
    }
});

document.getElementById("form").addEventListener("submit", (e) => {
    if (errorMesssage.innerHTML.length > 0) {
        e.preventDefault();
    }
});
