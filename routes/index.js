var express = require('express');
var router = express.Router();

/* 记帐本列表 */
router.get('/account', function(req, res, next) {
  res.render('list');
});

router.post('/account', (req, res) => {
  //因为app.js已经给了app.use(express.json())和app.use(express.urlencoded({extended:false}))的中间件调用，所以已经直接可以用req.body
  console.log(req.body)
  res.send('添加记录')
})

router.get('/account/create', function(req, res, next) {
  res.render('create');
});

module.exports = router;
