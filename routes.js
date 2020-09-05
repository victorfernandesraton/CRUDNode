var router = require('express').Router();

const User = require('./user/');

router.use('/user',User.Router);

module.exports = router;