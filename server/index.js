const express = require('express')
const app = express()
const UserModel = require("./models/Users")
require('dotenv').config()

const auth = require("./auth");

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


app.get("/login", async (req,res) => {
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

app.get("/suggestedUsers", async (req,res) => {
    UserModel.find({username: req.query.username}, (err, result) => {
        if(err) {
            res.json(err)
        } else {
            let followingList = []
            result[0].following.forEach(element => followingList.push(element.username))

            UserModel.find({}, (err, result) => {
                if(err) {
                    res.json(err)
                } else {
                    let array = []
                    for(let i = 0; i < result.length; i++) {
                        if(result[i].username !== req.query.username && followingList.indexOf(result[i].username) < 0) {
                            array.push({username:result[i].username,email:result[i].email})
                        }
                    }
                    res.send(array)
                }
            })
        }
    })
})

app.put("/followUser", async (req,res) => {
    try {
        const { follower, following } = req.body

        let doc = await UserModel.findOne({username: follower})
        doc.following.push({
            username: following
        })
        doc.save()

        doc = await UserModel.findOne({username: following})
        doc.followers.push({
            username: follower
        })
        doc.save()
        
        res.send('user followed')
    } catch (error) {
        res.send(error)
    }
})

app.put("/unfollowUser", async (req,res) => {
    try {
        const { unfollower, target } = req.body

        let doc = await UserModel.findOne({username: unfollower})
        let index = doc.following.find(e => e.username == target)
        // console.log(doc.following)
        // console.log(doc.following.indexOf(index))
        if (doc.following.indexOf(index) > -1) {
            doc.following.splice(doc.following.indexOf(index),1)
        }
        doc.save()

        doc = await UserModel.findOne({username: target})
        index = doc.followers.find(e => e.username == unfollower)
        if (doc.followers.indexOf(index) > -1) {
            doc.followers.splice(doc.followers.indexOf(index),1)
        }
        doc.save()

        res.send("user unfollowed")

    } catch (error) {
        res.send(error)
    }
})

app.post("/newTweet", auth, async (req,res) => {
    try {
        const { username , tweet } = req.body

        let doc = await UserModel.findOne({username: username})
        doc.tweets.push({
            content: tweet,
            date: Date.now(),
            likes: [],
            postedBy: username
        })

        doc.save()

        res.send('tweet posted')

    } catch (error) {
        res.send(error)
    }
})

app.get("/getTweets", async (req,res) => {
    try {
        let doc = await UserModel.findOne({username: req.query.username})

        let array = []
        doc.tweets.forEach(e => array.push(e))

        for(let i = 0; i < doc.following.length; i++) {
            let tempUser = await UserModel.findOne({username: doc.following[i].username})
            tempUser.tweets.forEach(e => array.push(e))
        }

        res.send(array)
    } catch (error) {
        res.send(error)
    }
})

app.get("/getUser", async (req,res) => {
    try{
        let doc = await UserModel.findOne({username: req.query.username})
        res.send(doc)
    } catch (error) {
        res.send(error)
    }
})

// app.get("/getUserFollowing", async (req,res) => {
//     try {
//         let doc = await UserModel.findOne({username: req.query.username})
//         res.send({...doc.following, ...doc.username})
//         // console.log(doc.following)
//     } catch (error) {
//         res.send(error)
//     }
// })

app.put("/likeTweet/:id", auth, async (req,res) => {
    try {
        let doc = await UserModel.findOne({username: req.body.postedBy})
        doc.tweets.find((tweet) => {
            if (tweet._id == req.params.id) {
                tweet.likes.push(req.body.username)
            }
        });
        doc.save()

        res.send('liked tweet')
    } catch (error) {
        res.send(error)
    }
})

app.put("/unlikeTweet/:id", auth, async (req,res) => {
    try {
        // let doc = await UserModel.findOne({'tweets': {$elemMatch: {'field': '_id', 'value': req.params.id}}})
        // console.log(req.body, req.params)
        
        let doc = await UserModel.findOne({username: req.body.postedBy})
        doc.tweets.find((tweet) => {
            if (tweet._id == req.params.id) {
                const index = tweet.likes.indexOf(req.body.username);
                if (index > -1) {
                    tweet.likes.splice(index,1)
                }
            }
        });
        doc.save()

        res.send('unliked tweet')
    } catch (error) {
        res.send(error)
    }
})

// app.put("/unfollowUser", async (req,res) => {
//     try {
//         const { follower, following } = req.body

//         let doc = await UserModel.findOne({username: follower})
//         doc.following.push({
//             username: following
//         })
//         doc.save()

//         doc = await UserModel.findOne({username: following})
//         doc.followers.push({
//             username: follower
//         })
//         doc.save()
//         // console.log(doc)
//         // res.send("following")
//         res.send('user followed')
//     } catch (error) {
//         res.send(error)
//     }
// })


app.get("/test", (req,res) => {
    res.send('Hello World!')
})

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log('LISTENING TO PORT ' + port)
})