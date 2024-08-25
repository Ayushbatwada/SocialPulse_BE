'use strict'

const commentModel = require('./model');
const commentConfig = require('./config.json');
const sanityChecks = require("../../utils/sanityChecks");
const responseData = require('../../utils/responseData');

module.exports = {
    addComment: (body, callback) => {
        let response;
        const postType = body.postType;
        const postId = body.postId;
        const flowType = body.flowType;
        const flowId = body.flowId;
        const comment = body.comment;
        const createdBy = body.createdBy;

        if (!sanityChecks.isValidString(postType) || !sanityChecks.isValidMongooseId(postId) || !createdBy ||
            !commentConfig.postTypes.values.includes(postType) || !sanityChecks.isValidMongooseId(createdBy.userId) ||
            !sanityChecks.isValidString(flowType) || !sanityChecks.isValidMongooseId(flowId) ||
            !commentConfig.flowTypes.values.includes(flowType) || !sanityChecks.isValidString(comment)) {
            console.log('ERROR ::: Missing info in "like" service with info, postType: ' + postType +
                '. createdBy: ' + JSON.stringify(createdBy) + '. postId: ' + postId + '. flowType: ' + flowType +
                '. flowId: ' + flowId + '. comment: ' + comment);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const comment = new commentModel();
            comment.comment = body.comment;
            comment.postType = body.postType;
            comment.flowType = body.flowType;
            comment.postId = body.postId;
            comment.flowId = body.flowId;
            comment.createdBy = body.createdBy;
            comment.userInfo = body.createdBy.userId;

            comment.save().then((dbResp) => {
                response = new responseData.successMessage();
                callback(null, response);
            }).catch((err) => {
                console.log('ERROR ::: found in "addComment" service db error catch block with err: ' + err);
                response = new responseData.serverError();
                callback(null, response);
            });
        } catch (err) {
            console.log('ERROR ::: found in "addComment" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    getAllComments: (req, callback) => {
        let response;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const flowId = req.query.fid

        if (!sanityChecks.isValidMongooseId(flowId)) {
            console.log('ERROR ::: Missing info in "getAllComments service with info, flowId: ' + flowId);
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
                status: commentConfig.status.active,
                flowId: flowId
            };
            commentModel.paginate(filterQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "getAllComments" service error block with err: ' + err);
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
            console.log('ERROR ::: found in "getAllComments" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    deleteComment: (body, callback) => {
        let response;
        const flowId = body.flowId;
        const createdBy = body.createdBy;

        if (!createdBy || !sanityChecks.isValidMongooseId(createdBy.userId) || !sanityChecks.isValidMongooseId(flowId)) {
            console.log('ERROR ::: Missing info in "deleteComment" service with info, flowId: ' + flowId +
                '. createdBy: ' + JSON.stringify(createdBy));
            response = new responseData.payloadError();
            return callback(null, response);
        }

        const filterQuery = {
            flowId: flowId,
            "createdBy.userId": createdBy.userId
        };
        const updateQuery = {
            status: commentConfig.status.deleted
        };
        const options = {
            upsert: false,
            returnDocument: "before"
        };

        try {
            commentModel.findOneAndUpdate(filterQuery, updateQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "deleteComment" service error block with err: ' + err);
                    response = new responseData.serverError();
                    return callback(null, response);
                } else if (sanityChecks.isValidObject(dbResp) && dbResp.status === commentConfig.status.deleted) {
                    response = new responseData.alreadyCommentDeletedErrorMessage();
                    return callback(null, response);
                } else if (sanityChecks.isValidObject(dbResp) && dbResp.status === commentConfig.status.active) {
                    response = new responseData.successMessage();
                    return callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    return callback(null, response);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found in "deleteComment" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },
}
