const express = require('express')
const app = express()
const UserModel = require("./models/Users")
require('dotenv').config()

const cors = require('cors')
app.use(express.json())
app.use(cors())

const jwt = require("jsonwebtoken");
// https://www.section.io/engineering-education/how-to-build-authentication-api-with-jwt-token-in-nodejs/

const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
mongoose.connect(`mongodb+srv://ulukbek:${process.env.REACT_APP_MONGODB}@cluster0.tmdxd0r.mongodb.net/user-database?retryWrites=true&w=majority`)

app.get("/test", (req,res) => {
    res.send('Hello World!')
})

app.post("/newUser", async (req,res) => {
    const user = req.body
    const newUser = new UserModel(user)
    await newUser.save()
    res.json(user)
})


app.get("/checkEmail/:email", (req, res) => {
    try {
        UserModel.find({email: req.params.email}, (err, result) => {
            if(err) {
                res.json(err)
            } else {
                res.json(result)
            }
        })
    } catch {
        res.send({error: 'email not found!'})
    }
})


app.get("/checkUsername/:username", (req, res) => {
    try {
        UserModel.find({username: req.params.username}, (err, result) => {
            if(err) {
                res.json(err)
            } else {
                res.json(result)
            }
        })
    } catch {
        res.send({error: 'username not found!'})
    }
})


app.get("/login", (req,res) => {
    const { email, password } = req.query;
    try {
        UserModel.find({email: email}, (err, result) => {
            if(password === result[0].password) {
                console.log('match!')
            }
        })
    } catch (err) {
        res.send(err)
    }
})



const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log('LISTENING TO PORT ' + port)
})