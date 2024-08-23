const healthCheck = require('./server/utils/healthCheck');
const postRouter = require('./server/posts/routes');
const likesRouter = require('./server/likes/routes');
const commentsRouter = require('./server/comments/routes');

module.exports = (app) => {
    app.use('/healthCheck', healthCheck);

    app.use('v1/api/posts', postRouter);
    app.use('v1/api/likes', likesRouter);
    app.use('v1/api/comments', commentsRouter);
}
