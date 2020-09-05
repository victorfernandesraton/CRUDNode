const router = require('express').Router()

const UserService = require('./user.service');

router.get('/',async (req, res, send) => {
    try {
        const data = await UserService.index({})
        res.render('show/user', {data})
    } catch (error) {
        send(error)
    }
})

router.get('/create', (req, res, send) => {
    try {
        res.render('create/user')
    } catch (error) {
        send(error)
    }
})

router.post('/',async (req, res, send) => {
    try {
        const record = await UserService.store({user : {...req.body}})
        const data = await UserService.index({})
        res.render('show/user', {data});
    } catch (error) {
        res.send(error)
    }
})

module.exports = router