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