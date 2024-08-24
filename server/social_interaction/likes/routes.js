'use strict';

const express = require('express');
const postsController = require('./controller');

const router = express.Router();

router.put('/post/like', postsController.likePost);
router.put('/comment/like', postsController.likeComment);
router.put('/post/dislike', postsController.dislikePost);
router.put('/comment/dislike', postsController.dislikeComment);

module.exports = router;
