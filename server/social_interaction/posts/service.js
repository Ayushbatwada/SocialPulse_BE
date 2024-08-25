'use strict'

const postModel = require('./model');
const postConfig = require('./config.json');
const sanityChecks = require('../../utils/sanityChecks');
const responseData = require('../../utils/responseData');

module.exports = {
    createPost: (body, callback) => {
        let response;
        const title = body.title;
        const description = body.description;
        const postType = body.postType;
        const thumbnailImage = body.thumbnailImage;
        const medias = body.medias;
        const createdBy = body.createdBy;

        if (!sanityChecks.isValidString(postType) || !createdBy || !postConfig.postTypes.values.includes(postType) ||
            !sanityChecks.isValidMongooseId(createdBy.userId) || !sanityChecks.isValidString(title) || !sanityChecks.isValidString(description)) {
            console.log('ERROR ::: Missing info in "createPost" service with info, postType: ' + postType +
                '. createdBy: ' + JSON.stringify(createdBy) + '. title: ' + title + '. description: ' + description);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const post = new postModel();
            post.title = title;
            post.description = description;
            post.postType = postType;
            post.thumbnailImage = thumbnailImage;
            post.medias = medias;
            post.createdBy = createdBy;
            post.userInfo = createdBy.userId;

            post.save().then((dbResp) => {
                response = new responseData.successMessage();
                callback(null, response);
            }).catch((err) => {
                console.log('ERROR ::: found in "createPost" service db error catch block with err: ' + err);
                response = new responseData.serverError();
                callback(null, response);
            });
        } catch (err) {
            console.log('ERROR ::: found in "createPost" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    getAllPosts: (req, callback) => {
        let response;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        try {
            const options = {
                page: page,
                limit: limit,
                customLabels: responseData.customLabels
            };
            const filterQuery = {
                status: postConfig.status.active
            };
            postModel.paginate(filterQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "getAllPosts" service error block with err: ' + err);
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
            console.log('ERROR ::: found in "getAllPosts" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    getPostDetail: (req, callback) => {
        let response;
        const postId = req.query.poid

        if (!sanityChecks.isValidMongooseId(postId)) {
            console.log('ERROR ::: Missing info in "getPostDetail service with info, postId: ' + postId);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const filterQuery = {
                status: postConfig.status.active,
                _id: postId
            };
            postModel.findOne(filterQuery, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "getPostDetail" service error block with err: ' + err);
                    response = new responseData.serverError();
                    callback(null, response);
                } else if (sanityChecks.isValidObject(dbResp)) {
                    response = new responseData.successMessage();
                    response.data = dbResp;
                    callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    return callback(null, response);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found in "getPostDetail" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    editPost: (body, callback) => {
        let response;
        const postId = body.postId;
        const factor = body.factor || 0;

        if (!sanityChecks.isValidMongooseId(postId)) {
            console.log('ERROR ::: Missing info in "deleteComment" service with info, postId: ' + postId);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        const filterQuery = {
            _id: postId,
            status: postConfig.status.active
        };
        const updateQuery = {
            likesCount: { $in: factor }
        };

        try {
            postModel.findOneAndUpdate(filterQuery, updateQuery, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "editPost" service error block with err: ' + err);
                    response = new responseData.serverError();
                    return callback(null, response);
                } else if (sanityChecks.isValidObject(dbResp)) {
                    response = new responseData.successMessage();
                    return callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    return callback(null, response);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found in "editPost" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },


    deletePost: (body, callback) => {
        let response;
        const postId = body.postId;
        const createdBy = body.createdBy;

        if (!createdBy || !sanityChecks.isValidMongooseId(createdBy.userId) || !sanityChecks.isValidMongooseId(postId)) {
            console.log('ERROR ::: Missing info in "deleteComment" service with info, postId: ' + postId +
                '. createdBy: ' + JSON.stringify(createdBy));
            response = new responseData.payloadError();
            return callback(null, response);
        }

        const filterQuery = {
            _id: postId,
            "createdBy.userId": createdBy.userId
        };
        const updateQuery = {
            status: postConfig.status.deleted
        };
        const options = {
            upsert: false,
            returnDocument: "before"
        };

        try {
            postModel.findOneAndUpdate(filterQuery, updateQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "deletePost" service error block with err: ' + err);
                    response = new responseData.serverError();
                    return callback(null, response);
                } else if (sanityChecks.isValidObject(dbResp) && dbResp.status === postConfig.status.deleted) {
                    response = new responseData.alreadyDeletedErrorMessage();
                    return callback(null, response);
                } else if (sanityChecks.isValidObject(dbResp) && dbResp.status === postConfig.status.active) {
                    response = new responseData.successMessage();
                    return callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    return callback(null, response);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found in "deletePost" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },
}
