'use strict';

const express = require('express');
const commentsController = require('./controller');

const router = express.Router();

router.post('/add/new', commentsController.addComment);
router.put('/edit', commentsController.editComment);
router.put('/root/all/get', commentsController.getAllRootComments);
router.put('/reply/all/get', commentsController.getAllReplyComments);
router.put('/delete', commentsController.deleteComment);

module.exports = router;
