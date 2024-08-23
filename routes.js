const healthCheck = require('./server/utils/healthCheck');
const postRouter = require('./server/posts/routes');
const likesRouter = require('./server/likes/routes');

module.exports = (app) => {
    app.use('/healthCheck', healthCheck);

    app.use('v1/api/post', postRouter);
    app.use('v1/api/like', likesRouter);
}
