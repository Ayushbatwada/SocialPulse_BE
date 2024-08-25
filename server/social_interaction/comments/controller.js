'use strict'

const commentService = require('./service');
const likeService = require('../likes/service');
const responseData = require('../../utils/responseData');

module.exports = {
    addComment: (req, res) => {
        let response;
        try {
            commentService.addComment(req.body, (err, addCommentResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "addComment" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
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
