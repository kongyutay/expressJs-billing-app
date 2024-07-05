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
            return
        }
        res.render('success', {msg:'注册成功', url: '/login'});
    })
})

router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/login', (req, res) => {
    //查询数据库，看有没有匹配
    let {username, password} = req.body
    UserModel.findOne({username: username, password: md5(password)}, (err, data) => {
        //判断
        if(err) {
            res.status(500).send('登陆失败')
            return
        }
        if(!data) {
            res.send('账号或密码错误')
        }
        //写入session
        req.session.username = data.username;
        req.session._id = data._id;             //这是用户文档的id，不是sessionid

        //登录成功
        res.render('success', {msg: '登陆成功', url: '/account'})
    })

})

//退出登录
router.get('/logout', (req, res) => {
    //销毁session
    req.session.destroy(() => {
        res.render('success', {msg: '退出成功', url: '/login'})
    })
})

module.exports = router;