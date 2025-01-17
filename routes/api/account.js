var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')

const moment = require('moment');
const AccountModel = require('../models/AccountModel');
const checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware')


/* 记帐本列表 */
router.get('/account', checkTokenMiddleware, function(req, res, next) {
  
  
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

router.post('/account', checkTokenMiddleware, (req, res) => {
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

router.delete('/account/:id', checkTokenMiddleware, (req, res) => {
  //get param id
  let id = req.params.id;
  //delete
  AccountModel.deleteOne({_id:id}, (err, data) => {
    if(err) {
      res.json({
        code: '1003',
        msg: '删除账单失败',
        data: null
      })
      return
    }
    res.json({
        code: '0000',
        msg: '删除成功',
        data: {}
    })
  })
})

//获取单个账单信息
router.get('/account/:id', checkTokenMiddleware, (req,res) => {
    let {id} = res.params;
    AccountModel.findById(id, (err, data) => {
        if(err) {
            return res.json({
                code: '1004',
                msg: '读取失败',
                data: null
            })
        }
        res.json({
            code: '0000',
            msg: '读取成功',
            data: data
        })
    })
})

//更新账单信息
router.patch('/account/:id', checkTokenMiddleware, (req, res) => {
    let { id } = req.params;

    //updateOne接受三个参数，第一个是查询，第二个是更改的内容，会放在请求体的body里面所以要取出来，第三个要回调处理
    AccountModel.updateOne({_id:id}, req.body, (err, data) => {
        if(err) {
            return res.json({
                code: '1005',
                msg: '更新失败',
                data: null
            })
        }

        AccountModel.findById(id, (err, data) => {
            if(err) {
                return res.json({
                    code: '1004',
                    msg: '读取失败',
                    data: null
                })
            }
            res.json({
                code: '0000',
                msg: '更新成功',
                data: data  //如果没有上面的代码，返回结果和预期的不一样，所以要再次查询数据库获得数据
            })
        })
        
    })
})

//已经形成回调地狱，之后要使用promise的方式优化

module.exports = router;
