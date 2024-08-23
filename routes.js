const healthCheck = require('./server/utils/healthCheck');
const postRouter = require('./server/posts/routes');

module.exports = (app) => {
    app.use('/healthCheck', healthCheck);

    app.use('v1/api/post', postRouter);
}
