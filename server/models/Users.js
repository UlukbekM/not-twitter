// const { text } = require("express")
const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    profilePicture: {
        type: String,
        required: false
    },
    profileKey: {
        type: String,
        required: false
    },
    bannerPicture: {
        type: String,
        required: false
    },
    bannerKey: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    followers: [{
        username: {
            type: String,
            required: true
        }
    }],
    following: [{
        username: {
            type: String,
            required: true
        }
    }],
    tweets: [{
        content: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        likes: [{
            type: String,
            required: true
        }],
        postedBy: {
            type: String,
            required: true
        },
        imageURL: {
            type: String,
            required: false
        },
        imageKey: {
            type: String,
            required: false
        },
        userImage: {
            type: String,
            required: false
        },
        comments: [{
            content: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true
            },
            likes: {
                type: Number,
                required: true
            },
        }]
    }]
})

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel