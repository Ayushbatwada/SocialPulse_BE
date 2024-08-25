'use strict'

const likeService = require('./service');
const postService = require('../posts/service')
const responseData = require('../../utils/responseData');

module.exports = {
    like : (req, res) => {
        let response;
        try {
            likeService.like(req.body, (err, likeResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "like" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (likeResponse.code === 200 && likeResponse.status === 'success') {
                    const editPostBody = {
                        postId: req.body.flowId,
                        factor: 1
                    }
                    postService.editPost(editPostBody, (err, editPostResponse) => {
                        if (editPostResponse.code === 200 && editPostResponse.status === 'success') {
                            console.log('INFO ::: found in editPost inside like with status: ' + editPostResponse.status);
                        } else {
                            console.log('INFO ::: found in editPost inside like with status: ' + editPostResponse.status);
                        }
                    })
                    res.status(likeResponse.code).send(likeResponse);
                } else {
                    res.status(likeResponse.code).send(likeResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "like" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    dislike: (req, res) => {
        let response;
        try {
            likeService.dislike(req.body, (err, dislikeResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "dislike" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (dislikeResponse.code === 200 && dislikeResponse.status === 'success') {
                    const editPostBody = {
                        postId: req.body.flowId,
                        factor: -1
                    }
                    postService.editPost(editPostBody, (err, editPostResponse) => {
                        if (editPostResponse.code === 200 && editPostResponse.status === 'success') {
                            console.log('INFO ::: found in editPost inside dislike with status: ' + editPostResponse.status);
                        } else {
                            console.log('INFO ::: found in editPost inside dislike with status: ' + editPostResponse.status);
                        }
                    })
                    res.status(dislikeResponse.code).send(dislikeResponse);
                } else {
                    res.status(dislikeResponse.code).send(dislikeResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "dislike" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    getFlowLikesInfo: (req, res) => {
        let response;
        try {
            likeService.getFlowLikesList(req, (err, getFlowLikesInfoResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "getFlowLikesInfo" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(getFlowLikesInfoResponse.code).send(getFlowLikesInfoResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "getFlowLikesInfo" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    }
}
