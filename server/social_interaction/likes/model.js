'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const likesConfig = require('./config.json');
const UserSchema = require('../userModel');

const likeSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    postType: {
        type: String,
        enum: likesConfig.postTypes.values,
        required: true
    },
    flowId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    flowType: {
        type: String,
        enum: likesConfig.flowTypes.values,
        required: true
    },
    status: {
        type: String,
        default: likesConfig.status.active,
        enum: likesConfig.status.values
    },
    userInfo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdBy: {
        type: UserSchema,
        required: true
    },
}, {
    timestamps: true
});

likeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('likes', likeSchema);
