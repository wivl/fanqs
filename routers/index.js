const Router = require('koa-router');
const router = new Router();

// 整合路由
const apiRouter = require('./api');


router.redirect('/', '/public/index.html');
router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());

module.exports = router;
