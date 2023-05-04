import React, {useState, useEffect} from "react";
import Row from 'react-bootstrap/Row';
// import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Axios from 'axios';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
// import Image from 'react-bootstrap/Image'
import jwt_decode from "jwt-decode";
import Dropdown from 'react-bootstrap/Dropdown';
import AWS from 'aws-sdk';
import { useNavigate } from "react-router-dom";


AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESSKEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESSKEY,
    region: 'us-east-1',
    signatureVersion: 'v4',
});

export const Tweet = (tweet) => {
    // console.log(tweet)
    let navigate = useNavigate();
    const s3 = new AWS.S3();
    const {tweetBackground , tweetTitleColor, tweetTextColor, tweetButtonBackgroundColor, tweetButtonColor, api} = tweet.theme
    const location = useLocation();
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(0)
    const [comments, setComments] = useState(0)
    const [ownPage, setOwnPage] = useState(false)
    const [imageURL, setImageURL] = useState("")
    const [userImage, setUserImage] = useState("https://img.icons8.com/external-becris-lineal-becris/256/external-user-mintab-for-ios-becris-lineal-becris.png")


    const [deleted, setDeleted] = useState(false)

    const [mainUser, setMainUser] = useState(false)

    const checkLocation = (name) => {
        if(window.location.pathname.includes(name)){
            setOwnPage(true)
        } else {
            setOwnPage(false)
        }
    }

    useEffect(() => {
        if(tweet.profilePicture) {
            setUserImage(tweet.profilePicture)
        }

    }, [tweet.profilePicture]);

    useEffect(() => {
        checkLocation(tweet.postedBy)

        let token = window.sessionStorage.getItem("token");
        let decoded = jwt_decode(token)

        if(tweet.postedBy === decoded.username) {
            setMainUser(true)
        } else {
            setMainUser(false)
        }

    }, [location]);

    useEffect(()=> {
        setLikes(tweet.likes.length)
        setComments(tweet.comments.length)
        if(tweet.likes.includes(tweet.username)) {
            setLiked(true)
        }
        if(tweet.imageURL) {
            setImageURL(tweet.imageURL)
        }
        getUserImage()
    },[])

    // const api = 'http://localhost:3001'

    const clickButton = () => {
        if(liked) {
            Axios.put(`${api}/unlikeTweet/${tweet._id}`, { 
                username: tweet.username,
                token: window.sessionStorage.getItem("token"),
                postedBy: tweet.postedBy
            })
            .then((response)=> {
                console.log(response)
                if(response.data === 'unliked tweet') {
                    setLiked(false)
                    setLikes(likes-1)
                }
            })
        } else {
            Axios.put(`${api}/likeTweet/${tweet._id}`, { 
                username: tweet.username,
                token: window.sessionStorage.getItem("token"),
                postedBy: tweet.postedBy
            })
            .then((response)=> {
                console.log(response)
                if(response.data === 'liked tweet') {
                    setLiked(true)
                    setLikes(likes+1)
                }
            })
        }
    }

    const getUserImage = () => {
        if(tweet.profilePicture) {
            setUserImage(tweet.profilePicture)
        } else if(tweet.userImage) {
            setUserImage(tweet.userImage)
        }
    }

    let mobileCol1 = 2
    let mobileCol2 = 9
    let mobileCol3 = 1

    const deleteTweet = async () => {
        // console.log(tweet)
        if(tweet.imageKey) {
            var params = { Bucket: process.env.REACT_APP_BUCKET_NAME, Key: tweet.imageKey }
            s3.deleteObject(params, function(err, data) {
              // if(err) console.log(err)
              // else console.log(data)
            })
        }

        Axios.delete(`${api}/deleteTweet/${tweet.username}/${tweet._id}/`, {data: {token: window.sessionStorage.getItem("token") }})
        .then((response)=> {
            console.log(response)
            if(response.data === "tweet deleted") {
                setDeleted(true)
            }
        })
    }

    const openTweet = () => {
        let path = "../../" + tweet.postedBy + "/status/" + tweet._id
        navigate(path);
    }

    return(<>
    {deleted ? <></> :
        // <Link to={"../../" + tweet.postedBy + "/status/" + tweet._id} style={{textDecoration: "none"}}>
            <Container lg={10}
            // onClick={openTweet}
            style={{backgroundColor: tweetBackground, margin: "1em 0", borderRadius: "5px", color: tweetTextColor}}>

            <Row style={{paddingTop: "1em"}}>
                <Col xs={mobileCol1} lg={1} style={{display: "flex", textAlign: "center", justifyContent: "center"}}>
                    {ownPage ?
                        // <i className="bi bi-person-circle" style={{fontSize: "2rem", color: tweetTitleColor, cursor: "pointer"}}></i>
                        <img src={userImage} 
                        style={{width: "40px", height: "40px", cursor: "pointer", borderRadius: "50%"}}/>
                    :
                    <Link to={tweet.postedBy} className="userFollow">
                        {/* <i className="bi bi-person-circle" style={{fontSize: "2rem", color: tweetTitleColor}}></i> */}
                        <img src={userImage}  
                        style={{width: "40px", height: "40px", cursor: "pointer", borderRadius: "50%"}}/>
                    </Link>
                    }
                </Col>

                <Col xs={7} lg={10} style={{display: "flex", alignItems: "center"}}>
                    <div style={{color: tweetTitleColor}}>
                        {ownPage ? 
                            <p style={{color: tweetTitleColor, cursor: "pointer",display: "inline", margin: "0.3em 0", fontWeight: "bold"}}>@{tweet.postedBy}</p> : 
                            <Link to={tweet.postedBy} className="userFollow">
                                <p style={{color: tweetTitleColor, display: "inline", margin: "0.3em 0", fontWeight: "bold"}}>@{tweet.postedBy}</p>
                            </Link>
                        }
                    </div>
                </Col>

                <Col xs={3} lg={1} style={{display: "grid", placeItems: "center"}}>

                    {mainUser && 
                        <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" style={{backgroundColor: tweetBackground, color: "#000", border: "none"}}>
                            <i className="bi bi-three-dots" style={{cursor: "pointer"}}></i>
                        </Dropdown.Toggle>
        
                        <Dropdown.Menu>
                            <Dropdown.Item style={{color: "red"}} onClick={deleteTweet}>Delete</Dropdown.Item>
                            {/* <Dropdown.Item href="#/action-2">Another action</Dropdown.Item> */}
                            {/* <Dropdown.Item href="#/action-3">Something else</Dropdown.Item> */}
                        </Dropdown.Menu>
                        </Dropdown>
                    }
                </Col>
            </Row>

            <Row>
                <Col xs={mobileCol1} lg={1}>
                </Col>

                <Col xs={mobileCol2} lg={10}>
                    <Row>
                        <p style={{color: tweetTextColor, marginBottom: "0.25em", fontWeight: 450, overflow: "auto", overflowWrap: "break-word"}}>
                            {tweet.content}
                        </p>
                    </Row>
                    <Row style={{display: "grid", placeItems: "center"}}>
                        { imageURL && 
                        <img src={imageURL} style={{padding: "1em 0", borderRadius: "40px", maxHeight: "400px", width: "auto"}} draggable="true"/>}

                        {/* {imageURL ?
                        <img src={imageURL} style={{padding: "1em 0", borderRadius: "10%", maxHeight: "400px", width: "auto"}} draggable="true"/>
                        :
                        <></>
                        } */}
                    </Row>
                </Col>

                <Col xs={mobileCol3} lg={1}></Col>
            </Row>

            <Row>
                <Col xs={mobileCol1} lg={1}>

                </Col>
                <Col xs={mobileCol2} lg={10}>
                    <Row>
                        <Col xs={6} lg={2} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            {/* // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FIX DISPLAY INLINE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                            {/* <Link style={{textDecoration: "inherit", display: "inline"}}> */}
                                <div className="commentButton tweetIcon iconEffect" onClick={openTweet}>
                                    <i className="bi bi-chat"/>
                                    {/* <i className="bi bi-chat-fill"></i> */}
                                    { comments }
                                </div>
                            {/* </Link> */}
                        </Col>
                        <Col xs={6} lg={2} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            { liked ? 
                            <div className="buttonLiked tweetIcon iconEffect" onClick={clickButton}>
                                <i className="bi bi-heart-fill"/>
                                { likes }
                            </div>
                            :
                            <div className="buttonNotLiked tweetIcon iconEffect" onClick={clickButton}>
                                <i className="bi bi-heart"/>
                                { likes }
                            </div> 
                            }
                        </Col>
                        
                        <Col xs={0} lg={8}>
                        </Col>
                    </Row>
                </Col>

                <Col xs={mobileCol3} lg={1}></Col>
            </Row>

            </Container>
        // </Link>
    }
        
    </>)
}