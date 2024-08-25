'use strict'

const likeService = require('./service');
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
                } else {
                    res.status(dislikeResponse.code).send(dislikeResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "dislike" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    }
}
