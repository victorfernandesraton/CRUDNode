var router = require('express').Router();

const User = require('./user/');
const Publication = require('./publication/');

router.use('/user',User.Router);
router.use('/pub',Publication.Router);

module.exports = router;