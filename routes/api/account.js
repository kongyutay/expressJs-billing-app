var express = require('express');
var router = express.Router();

const moment = require('moment');
const AccountModel = require('../models/AccountModel');

/* 记帐本列表 */
router.get('/account', function(req, res, next) {
  //先获取所有的账单信息
  //let accounts = db.get('accounts').value();
  AccountModel.find().sort({time: -1}).exec((err, data) => {
    if(err){
        //通常返回结果的时候，状态信息已经表示在code里面，没必要再加状态码，否则前端不好处理
      res.json({
        code: '1001',
        msg: '读取失败',
        data: null
      })
      return
    }

    //一般上返回三个属性，code，msg和data
    res.json({
        code: '0000',   //可以写成20000，0000等等
        msg: '读取成功',
        data: data
    })
  })
});

router.post('/account', (req, res) => {
    //可以再这里做数据验证或表单验证，不同的问题返回不同的error code
    
  //要把字符串变成日期
  //插入数据库
  AccountModel.create({
    ...req.body,
    time: moment(req.body.time).toDate()
  },(err, data) => {
    if(err){
      res.json({
        code: '1002',
        msg: '创建失败',
        data: null
      })
      return
    }
    res.json({
        code: '0000',
        msg: '创建成功',
        data: data
    })
  })
})

router.get('/account/:id', (req, res) => {
  //get param id
  let id = req.params.id;
  //delete
  AccountModel.deleteOne({_id:id}, (err, data) => {
    if(err) {
      res.status(500).send('删除失败')
      return
    }
    res.render('success', {msg: ':) 删除成功', url: '/account'});
  })
})

module.exports = router;
