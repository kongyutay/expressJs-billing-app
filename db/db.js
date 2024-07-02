const mongoose = require('mongoose');
const {DBHOST, DBPORT, DBNAME } = require('../config/config');
//封装成链接数据库的代码
module.exports = (success, error) => {
    //希望不用传入第二个参数，可是又不能完全没有，因为error形参会变成undefined，然后下面的function不会报错，所以要直接放默认值
    if(typeof error !== 'function') {
        err = ()=> {
            consoole.log('链接失败')
        }
    }
    mongoose.set('strictQuery', true);
    mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);

    mongoose.connection.on('open', () => {
        success()
    })

    //设置链接失败的回调
    mongoose.connection.on('error', () => {
        error()
    })

    //设置链接关闭的回调
    mongoose.connection.on('close', () => {
        console.log('链接关闭')
    })

}