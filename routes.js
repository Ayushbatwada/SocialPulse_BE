const healthCheck = require('./server/utils/healthCheck');
const postRouter = require('./server/social_interaction/posts/routes');
const likesRouter = require('./server/social_interaction/likes/routes');
const commentsRouter = require('./server/social_interaction/comments/routes');

module.exports = (app) => {
    app.use('/healthCheck', healthCheck);

    app.use('v1/api/posts', postRouter);
    app.use('v1/api/likes', likesRouter);
    app.use('v1/api/comments', commentsRouter);
}
