
/**
 * @reference https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s13.html
 * @description Validation for ISBN-10 or ISBN-13 books or publications ids
 * @param {String} payload 
 * @returns {Boolean}
 */
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

module.exports = validateIsbn;