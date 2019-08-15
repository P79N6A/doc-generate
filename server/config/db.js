// db.js
const Sequelize = require('sequelize');
const DBSequelize = new Sequelize(
    'doc', // 数据库名
    'root', // 用户名
    '0q9w8e7r', // 密码
    {
        host: 'localhost', // 数据库地址
        dialect: 'mysql', // 数据库类型
        port: 3306, // 端口号
        define: {
            underscored: true, // 字段以下划线分割
            timestamps: false // 取消自动添加时间戳
        }
    }
);
module.exports = {
    DBSequelize
}