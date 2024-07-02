const mongoose = require('mongoose')
//将来学了promise就不是写这里了
    //1. 创建文档的结构对象，约束文档的属性和属性的类型，setup结构罢了还没创建
    let BookSchema = new mongoose.Schema({
        name: String,
        author: String,
        price: Number
    })

    //2. 根据setup的结构创建模型对象，这个模型对象可以对文档操作的封装对象
    //books是集合名称
    let BookModel = mongoose.model('books', BookSchema)

module.exports = BookModel;