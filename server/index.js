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

app.post("/register", async (req,res) => {
    try {
        const { email, username, password } = req.body;
        
        if (!(email && username && password)) {     //Check if any of the fields are empty
            res.status(400).send("All fields must not be empty");
        }

        const findEmail = await UserModel.findOne({email: email})   //Check if email exists in database
        if (findEmail) {
            return res.status(409).send("Email Already Exists.");
        }
        
        const findUsername = await UserModel.findOne({username: username})      //Check if username exists in database
        if (findUsername) {
            return res.status(409).send("Username Already Exists.");
        }

        // encryptedPassword = await bcrypt.hash(password, 10);
        // console.log(encryptedPassword)

        const user = req.body
        const newUser = new UserModel(user)
        await newUser.save()

        const token = jwt.sign(
            {email:  email, username: username},
            process.env.JWT_TOKEN_KEY,
            { expiresIn: "2h" }
        )
        user.token = token

        res.json(user)
    } catch (err) {
        res.send(err)
    }
})


app.get("/login", (req,res) => {
    try {
        UserModel.find({email: req.query.email}, (err, result) => {
            if(result.length > 0) {
                if(req.query.password === result[0].password) {
                    const token = jwt.sign(
                        {email:  result[0].email, username: result[0].username},
                        process.env.JWT_TOKEN_KEY,
                        { expiresIn: "2h" }
                    )
                    res.send(token)
                }
                else {
                    res.send('incorrect password!')
                }
            } else {
                res.send("incorrect email!")
            }
        })
    } catch (err) {
        res.send(err)
    }
})


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


const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log('LISTENING TO PORT ' + port)
})