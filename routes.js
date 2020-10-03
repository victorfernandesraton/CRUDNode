var router = require('express').Router();

const Publication = require('./publication/');
const Livro = require('./livro/');
const Edit = require('./editora/');

router.use('/pub',Publication.Router);
router.use('/livro',Livro.Router);
router.use('/editora', Edit.Router);

module.exports = router;