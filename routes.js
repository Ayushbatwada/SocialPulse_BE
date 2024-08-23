const healthCheck = require('./server/utils/healthCheck')

module.exports = (app) => {
    app.use('/v1/api/healthCheck', healthCheck);
}
