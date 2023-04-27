const express = require('express')
const app = express()
const UserModel = require("./models/Users")
require('dotenv').config()
const bcrypt = require('bcrypt');

const auth = require("./auth");

const cors = require('cors')
app.use(express.json())
app.use(cors())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

        encryptedPassword = await bcrypt.hash(password, 10);
        console.log(encryptedPassword)

        const user = {
            email: email.toLowerCase(),
            username,
            password: encryptedPassword
        }

        const newUser = new UserModel(user)
        await newUser.save()

        const token = jwt.sign(
            {email:  email, username: username},
            process.env.JWT_TOKEN_KEY,
            { expiresIn: "2h" }
        )
        user.token = token

        res.json(user)

        // res.send(encryptedPassword)
    } catch (err) {
        res.send(err)
    }
})


app.get("/login", async (req,res) => {
    try {
        UserModel.find({email: req.query.email}, (err, result) => {
            if(result.length > 0) {
                if(bcrypt.compare(req.query.password, result[0].password)) {
                // if(req.query.password === result[0].password) {
                    const token = jwt.sign(
                        {email:  result[0].email, username: result[0].username, profile: result[0].profilePicture},
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
                            array.push({username:result[i].username,email:result[i].email, profilePicture: result[i].profilePicture})
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

app.get("/checkFollowing", async (req,res) => {
    try {
        let {follower, user} = req.query

        let doc = await UserModel.findOne({username: user})

        let check = false

        doc.followers.forEach(e => {
            if(e.username === follower) {
                check = true
            }
        })

        res.send(check)
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

app.put("/removeBanner", async (req,res) => {
    try {
        const { username } = req.body

        let doc = await UserModel.findOne({username: username})

        if(doc) {
            doc.bannerKey = undefined
            doc.bannerPicture = undefined
            await doc.updateOne({ $unset: { bannerKey: 1, bannerPicture: 1 } })
            // await doc.updateOne({ $unset: { bannerPicture: 1 } })
        }
        // console.log()
        await doc.save()

        res.send("banner removed")
    } catch (error) {
        res.send(error)
    }
})

app.post("/newTweet", auth, async (req,res) => {
    try {
        console.log(req.body)
        const { username , tweet , imageURL, imageKey} = req.body

        let doc = await UserModel.findOne({username: username})
        doc.tweets.push({
            content: tweet,
            date: Date.now(),
            likes: [],
            postedBy: username,
            imageURL: imageURL,
            imageKey: imageKey
        })

        await doc.save()

        res.send('tweet posted')

    } catch (error) {
        res.send(error)
    }
})

app.get("/getTweets", async (req,res) => {
    try {
        let doc = await UserModel.findOne({username: req.query.username})

        let tweetArray = []
        // let profileArray = []

        doc.tweets.forEach(e => {
            let tweet = e
            tweet.userImage = doc.profilePicture
            tweetArray.push(tweet)
        })
        // profileArray.push([doc.username,doc.profilePicture])

        for(let i = 0; i < doc.following.length; i++) {
            let tempUser = await UserModel.findOne({username: doc.following[i].username})
            // profileArray.push([tempUser.username,tempUser.profilePicture])
            tempUser.tweets.forEach(e => {
                let tweet = e
                tweet.userImage = tempUser.profilePicture
                // console.log(tweet)
                tweetArray.push(tweet)
            })
        }

        // let object = {tweetArray, profileArray}

        // res.send(object)
        res.send(tweetArray)
    } catch (error) {
        res.send(error)
    }
})

app.get("/getTweetInfo", async (req,res) => {
    try {
        let {username, id} = req.query

        let doc = await UserModel.findOne({username: username})

        let tweet = []

        doc.tweets.forEach(e => {
            if(e._id == id) {
                tweet = e
                tweet.userImage = doc.profilePicture
            }
        })

        res.send(tweet)
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


//auth

app.delete("/deleteTweet/:username/:id", async (req,res) => {
    try {
        const {username, id} = req.params

        // let doc = await UserModel.findOne({username: username})
        // console.log(username, id, doc)
        
        // await doc.tweets.find((tweet) => {
        //     if (tweet._id == id) {
        //         let index = doc.tweets.indexOf(tweet)
        //         console.log(index)
        //         if(index > -1) {
        //             doc.tweets.splice(index,1)
        //         }
        //     }
        // });

        // await doc.save()
        // res.send('tweet deleted')

        UserModel.findOneAndUpdate({username: username}, { $pull: { tweets: { _id: id } } }, { new: true })
        .then(updatedDoc => {
            console.log('Document updated:', updatedDoc);
        })
        .catch(err => {
            console.error('Error updating document:', err);
        });

        res.send('tweet deleted')
    } catch (error) {
        res.send(error)
    }
})

app.put("/uploadPicture", async (req,res) => {

    const { username , profilePicture , bannerPicture, profileKey, bannerKey} = req.body

    let doc = await UserModel.findOne({username: username})

    
    if(bannerPicture) {
        doc.bannerPicture = bannerPicture
        doc.bannerKey = bannerKey
    }
    if(profilePicture) {
        doc.profilePicture = profilePicture
        doc.profileKey = profileKey
    }

    await doc.save()

    const token = jwt.sign(
        {email:  doc.email, username: doc.username, profile: doc.profilePicture},
        process.env.JWT_TOKEN_KEY,
        { expiresIn: "2h" }
    )
    res.send([token,'images updated'])

    // res.send("images updated")
})

app.get("/getUserProfile", async (req,res) => {
    try{
        let doc = await UserModel.findOne({username: req.query.username})

        let item = {
            profile: doc.profilePicture,
            banner: doc.bannerPicture,
            profileKey: doc.profileKey,
            bannerKey: doc.bannerKey,
            description: doc.description
        }

        res.send(item)
    } catch (error) {
        res.send(error)
    }
})

app.get("/test", (req,res) => {
    res.send('Hello World!')
})


const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log('LISTENING TO PORT ' + port)
})