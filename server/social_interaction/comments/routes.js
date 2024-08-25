'use strict';

const express = require('express');
const commentsController = require('./controller');

const router = express.Router();

router.post('/add/new', commentsController.addComment);
router.get('/all/get', commentsController.getAllComments);
router.put('/delete', commentsController.deleteComment);

module.exports = router;
