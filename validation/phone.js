const {PhoneNumberUtil} = require('google-libphonenumber')
const phoneNumberUtil = PhoneNumberUtil.getInstance()

module.exports = (phone) => phoneNumberUtil.isValidNumberForRegion(phoneNumberUtil.parse(phone, 'BR'), 'BR');