var express = require('express');
var router = express.Router();

const moment = require('moment');
const AccountModel = require('../models/AccountModel');
const checkLoginMiddleware = require('../../middlewares/checkLoginMiddleware')

router.get('/', (req, res) => {
  res.redirect('/account');
})

/* 记帐本列表 */
router.get('/account', checkLoginMiddleware, function(req, res, next) {
  //先获取所有的账单信息
  //let accounts = db.get('accounts').value();
  AccountModel.find().sort({time: -1}).exec((err, data) => {
    if(err){
      res.status(500).send('读取失败')
      return
    }
    res.render('list', {accounts: data, moment:moment});
  })
});

router.post('/account', checkLoginMiddleware, (req, res) => {
  //要把字符串变成日期
  //插入数据库
  AccountModel.create({
    ...req.body,
    time: moment(req.body.time).toDate()
  },(err, data) => {
    if(err){
      res.status(500).send('插入失败')
      return
    }
    res.render('success', {msg: ':) 添加成功', url: '/account'});
  })
})

router.get('/account/create', checkLoginMiddleware, function(req, res, next) {
  res.render('create');
});

router.get('/account/:id', checkLoginMiddleware, (req, res) => {
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
