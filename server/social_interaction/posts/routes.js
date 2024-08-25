'use strict';

const express = require('express');
const postsController = require('./controller');

const router = express.Router();

router.post('/create/new', postsController.createPost);
router.get('/get/all', postsController.getAllPosts);
router.get('/detail', postsController.getPostDetail);
router.get('/delete', postsController.deletePost);

module.exports = router;
