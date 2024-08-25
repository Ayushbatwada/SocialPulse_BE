'use strict'

const likeModel = require('./model');
const likeConfig = require('./config.json');
const responseData = require('../../utils/responseData');
const sanityChecks = require('../../utils/sanityChecks');

module.exports = {
    like : (body, callback) => {
        let response;
        const postType = body.postType;
        const postId = body.postId;
        const flowType = body.flowType;
        const flowId = body.flowId;
        const createdBy = body.createdBy;

        if (!sanityChecks.isValidString(postType) || !sanityChecks.isValidMongooseId(postId) || !createdBy ||
            !likeConfig.postTypes.values.includes(postType) || !sanityChecks.isValidMongooseId(createdBy.userId) ||
            !sanityChecks.isValidString(flowType) || !sanityChecks.isValidMongooseId(flowId) ||
            !likeConfig.flowTypes.values.includes(flowType)) {
            console.log('ERROR ::: Missing info in "like" service with info, postType: ' + postType +
                '. createdBy: ' + JSON.stringify(createdBy) + '. postId: ' + postId + '. flowType: ' + flowType + '. flowId: ' + flowId);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const filterQuery = {
                flowId: flowId,
                "createdBy.userId": createdBy.userId
            };
            const updateQuery = {
                createdBy : createdBy,
                postType : postType,
                flowType : flowType,
                postId : postId,
                flowId : flowId,
                userInfo: createdBy.userId,
                status: likeConfig.status.active
            };
            const options = {
                upsert: true,
                returnDocument: "before"
            };
            likeModel.findOneAndUpdate(filterQuery, updateQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "like" service error block with err: ' + err);
                    response = new responseData.serverError();
                    return callback(null, response);
                } else if (sanityChecks.isValidObject(dbResp) && dbResp.status === likeConfig.status.active) {
                    response = new responseData.alreadyLikedErrorMessage();
                    return callback(null, response);
                } else {
                    response = new responseData.successMessage();
                    return callback(null, response);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found in "like" service catch block with err: ' + err);
            response = new responseData.serverError();
            return callback(null, response)
        }
    },

    dislike: (body, callback) => {
        let response;
        const flowId = body.flowId;
        const createdBy = body.createdBy;

        if (!createdBy || !sanityChecks.isValidMongooseId(createdBy.userId) || !sanityChecks.isValidMongooseId(flowId)) {
            console.log('ERROR ::: Missing info in "dislike" service with info, postType: ' + postType +
                '. createdBy: ' + JSON.stringify(createdBy) + '. postId: ' + postId + '. flowType: ' + flowType + '. flowId: ' + flowId);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const filterQuery = {
                flowId: flowId,
                "createdBy.userId": createdBy.userId
            };
            const updateQuery = {
                status: likeConfig.status.inactive
            };
            const options = {
                upsert: false,
                returnDocument: "before"
            };
            likeModel.findOneAndUpdate(filterQuery, updateQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "dislike" service error block with err: ' + err);
                    response = new responseData.serverError();
                    return callback(null, response);
                } else if (sanityChecks.isValidObject(dbResp) && dbResp.status === likeConfig.status.inactive) {
                    response = new responseData.alreadyDislikedErrorMessage();
                    return callback(null, response);
                } else if (sanityChecks.isValidObject(dbResp) && dbResp.status === likeConfig.status.active) {
                    response = new responseData.successMessage();
                    return callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    return callback(null, response);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found in "dislike" service catch block with err: ' + err);
            response = new responseData.serverError();
            return callback(null, response)
        }
    },

    getFlowLikesList : (req, callback) => {
        let response;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const flowId = req.query.fid

        if (!sanityChecks.isValidMongooseId(flowId)) {
            console.log('ERROR ::: Missing info in :getFlowLikesList: service with info, flowId: ' + flowId);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const options = {
                page: page,
                limit: limit,
                customLabels: responseData.customLabels
            };
            const filterQuery = {
                status: likeConfig.status.active,
                flowId: flowId
            };
            likeModel.paginate(filterQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "getFlowLikesList" service error block with err: ' + err);
                    response = new responseData.serverError();
                    callback(null, response);
                } else if (sanityChecks.isValidArray(dbResp.data)) {
                    response = new responseData.successMessage();
                    response = {...response, ...dbResp};
                    callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    return callback(null, response);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found in "getFlowLikesList" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },
}
