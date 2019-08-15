const user = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 登陆
const login = async function (ctx) {
  const data = {
    userName: ctx.request.body.userName,
  };
  const userInfo = await user.login(data);

  if (userInfo != null) { // 如果查无此用户会返回null
    if (!bcrypt.compareSync(ctx.request.body.password, userInfo.password)) { // 验证密码是否正确
      ctx.body = {
        success: false, // success标志位是方便前端判断返回是正确与否
        info: '密码错误！',
      };
    } else { // 如果密码正确
      const userToken = {
        name: userInfo.user_name,
        id: userInfo.id,
      };
      const secret = 'vue-koa-mysql-demo'; // 指定密钥，这是之后用来判断token合法性的标志
      const token = jwt.sign(userToken, secret); // 签发token
      ctx.body = {
        success: true,
        token, // 返回token
      };
    }
  } else {
    ctx.body = {
      success: false,
      info: '用户不存在！', // 如果用户不存在返回用户不存在
    };
  }
};

// 注册
const register = async function (ctx) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(ctx.request.body.password, salt);
  const data = {
    userName: ctx.request.body.userName,
    password: hash,
  };
  await user.register(data);
  ctx.body = {
    success: true,
  };
};
module.exports = {
  login,
  register,
};
