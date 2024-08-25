'use strict';

const express = require('express');
const postsController = require('./controller');

const router = express.Router();

router.post('/flow/like', postsController.like);
router.put('/flow/dislike', postsController.dislike);
router.get('/flow/like/get/all', postsController.getFlowLikesInfo);

module.exports = router;
