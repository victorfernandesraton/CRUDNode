var router = require('express').Router();

const User = require('./user/');
const Publication = require('./publication/');
const Livro = require('./livro/');

router.use('/user',User.Router);
router.use('/pub',Publication.Router);
router.use('/livro',Livro.Router);

module.exports = router;