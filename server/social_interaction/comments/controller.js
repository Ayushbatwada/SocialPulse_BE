'use strict'

const commentService = require('./service');
const postService = require('../posts/service');
const responseData = require('../../utils/responseData');
const likeService = require("../likes/service");

module.exports = {
    addComment: (req, res) => {
        let response;
        try {
            commentService.addComment(req.body, (err, addCommentResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "addComment" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (addCommentResponse.code === 200 && addCommentResponse.status === 'success') {
                    const editPostBody = {
                        postId: req.body.flowId,
                        commentFactor: 1
                    }
                    postService.editPost(editPostBody, (err, editPostResponse) => {
                        if (editPostResponse.code === 200 && editPostResponse.status === 'success') {
                            console.log('INFO ::: found in editPost inside addComment with status: ' + editPostResponse.status);
                        } else {
                            console.log('INFO ::: found in editPost inside addComment with status: ' + editPostResponse.status);
                        }
                    })
                    res.status(addCommentResponse.code).send(addCommentResponse);
                } else {
                    res.status(addCommentResponse.code).send(addCommentResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "addComment" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    getAllComments: (req, res) => {
        let response;
        try {
            commentService.getAllComments(req, (err, getAllRootCommentsResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "getAllRootComments" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (getAllRootCommentsResponse.code === 200 && getAllRootCommentsResponse.status === 'success') {
                    let flowIds = [];
                    getAllRootCommentsResponse.data.forEach((comment) => {
                        flowIds.push(comment._id);
                    });
                    const getUsersFlowLikeInfoBody = {
                        flowIds: flowIds,
                        userId: req.query.uid
                    };
                    likeService.getUsersFlowLikeInfo(getUsersFlowLikeInfoBody, (err, getUsersFlowLikeInfoResponse) => {
                        if (getUsersFlowLikeInfoResponse.code === 200 && getUsersFlowLikeInfoResponse.status === 'success') {
                            let commentIdsMap = {};
                            getUsersFlowLikeInfoResponse.data.forEach((likeInfo) => {
                                commentIdsMap[likeInfo.flowId] = true;
                            });
                            getAllRootCommentsResponse.data.forEach((post) => {
                                if (commentIdsMap.hasOwnProperty(post._id)) {
                                    post.hasUserLiked = true;
                                }
                            });
                            res.status(getAllRootCommentsResponse.code).send(getAllRootCommentsResponse);
                        } else {
                            res.status(getAllRootCommentsResponse.code).send(getAllRootCommentsResponse);
                        }
                    });
                } else {
                    res.status(getAllRootCommentsResponse.code).send(getAllRootCommentsResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "getAllRootComments" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    deleteComment: (req, res) => {
        let response;
        try {
            commentService.deleteComment(req.body, (err, deleteCommentResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "deleteComment" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (deleteCommentResponse.code === 200 && deleteCommentResponse.status === 'success') {
                    const editPostBody = {
                        postId: req.body.flowId,
                        commentFactor: -1
                    }
                    postService.editPost(editPostBody, (err, editPostResponse) => {
                        if (editPostResponse.code === 200 && editPostResponse.status === 'success') {
                            console.log('INFO ::: found in editPost inside deleteComment with status: ' + editPostResponse.status);
                        } else {
                            console.log('INFO ::: found in editPost inside deleteComment with status: ' + editPostResponse.status);
                        }
                    });
                    res.status(deleteCommentResponse.code).send(deleteCommentResponse);
                } else {
                    res.status(deleteCommentResponse.code).send(deleteCommentResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "deleteComment" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    }
}
