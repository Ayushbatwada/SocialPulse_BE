const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const commentsConfig = require('./config.json');
const UserSchema = require('../userModel');

const commentSchema = new mongoose.Schema({
        comment: {
            type: String,
            required: true,
        },
        createdBy: {
            type: UserSchema,
            required: true
        },
        postType: {
            type: String,
            enum: commentsConfig.postTypes.values,
            required: true
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        flowType: {
            type: String,
            enum: commentsConfig.flowTypes.values,
            required: true
        },
        flowId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        likesCount: {
            type: Number,
            default: 0
        },
        hasUserLiked: {
            type: Boolean,
            default: false
        },
        userInfo: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            default: commentsConfig.status.active,
            enum: commentsConfig.status.values,
        }
    },
    {
        timestamps: true
    }
)

commentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('comments', commentSchema);
