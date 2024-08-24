'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const postsConfig = require('./config.json');
const UserSchema = require('../userModel');
const MediaSchema = require('../mediaModel');

const postSchema = new mongoose.Schema({
        title: {
            required: true,
            type: String
        },
        description: {
            required: true,
            type: String
        },
        thumbnailImage: {
            type: MediaSchema
        },
        medias: {
            type: [MediaSchema]
        },
        createdBy: {
            type: UserSchema,
            required: true
        },
        postType: {
            type: String,
            default: postsConfig.postTypes.blog,
            enum: postsConfig.postTypes.values
        },
        likesCount: {
            type: Number,
            default: 0
        },
        commentsCount: {
            type: Number,
            default: 0
        },
        userInfo: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            default: postsConfig.status.active,
            enum: postsConfig.status.values
        }
    },
    {
        timestamps: true
    }
)

postSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('posts', postSchema);
