var express = require('express');
var router = express.Router();

//导入 lowdb 让它可以记录和读取数据
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync(__dirname + '/../data/db.json')
const db = low(adapter)

//导入shortid
const shortid = require('shortid');

/* 记帐本列表 */
router.get('/account', function(req, res, next) {
  //先获取所有的账单信息
  let accounts = db.get('accounts').value();
  res.render('list', {accounts: accounts});
});

router.post('/account', (req, res) => {
  //因为app.js已经给了app.use(express.json())和app.use(express.urlencoded({extended:false}))的中间件调用，所以已经直接可以用req.body
  console.log(req.body);

  //generate id
  let id = shortid.generate();
  //写入文件
  //使用shift往上边叠加，之后查找数据库的时候从上往下找会更快
  db.get('accounts').unshift({id:id, ...req.body}).write();
  res.render('success', {msg: ':) 添加成功', url: '/account'});
})

router.get('/account/create', function(req, res, next) {
  res.render('create');
});

router.get('/account/:id', (req, res) => {
  //get param id
  let id = req.params.id;
  //delete
  db.get('accounts').remove({id:id}).write();
  res.render('success', {msg: ':) 删除成功', url: '/account'});
})

module.exports = router;
