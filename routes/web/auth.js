var express = require('express');
var router = express.Router();
const UserModel = require('../../models/UserModel')
const md5 = require('md5')

router.get('/reg', (req, res) => {
    res.render('auth/reg')
})

router.post('/reg', (req, res) => {
    UserModel.create({...req.body, password: md5(req.body.password)}, (err, data) => {
        if(err) {
            res.status(500).send('注册失败')
        }
        res.render('success', {msg:'注册成功', url: '/login'});
    })
})

module.exports = router;