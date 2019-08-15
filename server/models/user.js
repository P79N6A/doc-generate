const db = require('../config/db');

const userModel = '../schema/user.js'; // 定义goods 数据表结构

const DB = db.DBSequelize; // 引入数据库
const User = DB.import(userModel); // 使用import方法，实例化Users

// 登陆请求
const login = async function (data) {
  const result = await User.findOne({
    where: {
      name: data.userName,
      password: data.password,
    },
  });
  return result;
};

// 注册请求
const register = async function (data) {
  await User.create({
    name: data.name,
    password: data.password,
  });
  return true;
};

module.exports = {
  login,
  register,
};
