const Koa = require('koa'); // 1. 引入koa
const Router = require('koa-router');
const json = require('koa-json');
const logger = require('koa-logger')
const bodyparse = require('koa-bodyparser');
const user = require('./server/controllers/user')
const app = new Koa(); // 2. new一个koa对象
const router = new Router();

// allowedMethods 可有可无。
// 作用是当请求api的方法匹配的时候，会调用该方法。
// 比如应该是GET请求，而前端发起的是POST请求，此时就会调用该中间件方法
app.use(router.routes()).use(router.allowedMethods());
app.use(json());
app.use(bodyparse());
app.use(logger());

/* 测你api */
router.get('/api/test', (ctx, next) => {
    ctx.body = 'hello world';
});

router.get('/user/list', async(ctx, next) => {
    const result = await user.getUserList();
    ctx.body = result;
});

router.post('/login', (ctx, next) => {
    user.login(ctx);
});

router.post('/register', (ctx, next) => {
    user.register(ctx);
})

app.listen(8889, () => {
    console.log('start success. http://localhost:8889');
}); // 3.监听端口并启动