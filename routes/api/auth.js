var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
const UserModel = require('../../models/UserModel')
const md5 = require('md5')


router.post('/login', (req, res) => {
    //查询数据库，看有没有匹配
    let {username, password} = req.body
    UserModel.findOne({username: username, password: md5(password)}, (err, data) => {
        //判断
        if(err) {
            res.status(500).send('登陆失败')
            res.json({
                code: '2001',
                msg: '数据库读取失败',
                data: null
            })
            return
        }
        if(!data) {
            res.json({
                code: '2002',
                msg: '用户名或密码错误',
                data: null
            })
        }

        let token = jwt.sign({
            username: data.username,
            _data: data._id
        }, 'atguigu', {
            expiresIn: 60 * 60 * 24 * 7
        })
        //响应token
        res.json({
            code: '0000',
            msg: '登录成功',
            data: token
        })

        //登录成功
        res.render('success', {msg: '登陆成功', url: '/account'})
    })

})

//退出登录
router.post('/logout', (req, res) => {
    //销毁session
    req.session.destroy(() => {
        res.render('success', {msg: '退出成功', url: '/login'})
    })
})

module.exports = router;