import React, {useState, useEffect} from "react";
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Axios from 'axios';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Image from 'react-bootstrap/Image'

export const Tweet = (tweet) => {
    const {tweetBackground , tweetTitleColor, tweetTextColor, tweetButtonBackgroundColor, tweetButtonColor} = tweet
    const location = useLocation();
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(0)
    const [comments, setComments] = useState(0)
    const [ownPage, setOwnPage] = useState(false)
    const [imageURL, setImageURL] = useState("")
    const [userImage, setUserImage] = useState("https://img.icons8.com/external-becris-lineal-becris/256/external-user-mintab-for-ios-becris-lineal-becris.png")

    const checkLocation = (name) => {
        if(window.location.pathname.includes(name)){
            setOwnPage(true)
        } else {
            setOwnPage(false)
        }
    }

    useEffect(() => {
        checkLocation(tweet.postedBy)
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

    const api = 'http://localhost:3001'

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

    return(<>
        {/* <img src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png" style={{width: "2rem", height: "2rem"}}/> */}
    <Container style={{backgroundColor: tweetBackground, margin: "1em 0", borderRadius: "5px", color: tweetTextColor}} lg={10}>
        {/* <Row>
            <Col xs={2} lg={1} style={{display: "flex", alignItems:"center", justifyContent:"center", padding: 0}}>
                <Link to={tweet.postedBy} className="userFollow">
                    <i className="bi bi-person-circle" style={{fontSize: "2rem", color: tweetTitleColor}}></i>
                </Link>
            </Col>

            <Col xs={10} lg={11}>
                <Row style={{}}>
                    <div style={{color: tweetTitleColor}}>
                        {ownPage ? 
                        <p style={{color: tweetTitleColor, cursor: "pointer",display: "inline", margin: "0.3em 0", fontWeight: "bold"}}>@{tweet.postedBy}</p> : 
                        <Link to={tweet.postedBy} className="userFollow">
                            <p style={{color: tweetTitleColor, display: "inline", margin: "0.3em 0", fontWeight: "bold"}}>@{tweet.postedBy}</p>
                        </Link> }
                    </div>
                </Row>

                <Row style={{margin: 0, overflow: "hidden", whiteSpace: "nowrap", width: "95%", height: "auto", padding: "0.5em 0"}}>
                    <p style={{margin: 0, padding: 0, textOverflow: "ellipsis"}}>
                        {tweet.content}
                    </p>
                </Row>

                <Row style={{}}>
                    <Col>
                        <i className="bi bi-chat"/>
                    </Col>
                    <Col>
                        { liked ? 
                        <div className="buttonLiked likeButton" onClick={clickButton}>
                            <i className="bi bi-heart-fill"/>
                            { likes }
                        </div>
                        :
                        <div className="buttonNotLiked likeButton" onClick={clickButton}>
                            <i className="bi bi-heart"/>
                            { likes }
                        </div> }
                    </Col>
                </Row>
            </Col>
        </Row> */}


        <Row style={{paddingTop: "1em"}}>
            <Col xs={mobileCol1} lg={1} style={{display: "flex", textAlign: "center", justifyContent: "center"}}>
                {ownPage ?
                    // <i className="bi bi-person-circle" style={{fontSize: "2rem", color: tweetTitleColor, cursor: "pointer"}}></i>
                    <img src={userImage} 
                    style={{width: "32px", height: "32px", cursor: "pointer", borderRadius: "50%"}}/>
                :
                <Link to={tweet.postedBy} className="userFollow">
                    {/* <i className="bi bi-person-circle" style={{fontSize: "2rem", color: tweetTitleColor}}></i> */}
                    <img src={userImage}  
                    style={{width: "32px", height: "32px", cursor: "pointer", borderRadius: "50%"}}/>
                </Link>
                }
            </Col>

            <Col xs={mobileCol2} lg={10} style={{display: "flex", alignItems: "center"}}>
                <div style={{color: tweetTitleColor}}>
                    {ownPage ? 
                        <p style={{color: tweetTitleColor, cursor: "pointer",display: "inline", margin: "0.3em 0", fontWeight: "bold"}}>@{tweet.postedBy}</p> : 
                        <Link to={tweet.postedBy} className="userFollow">
                            <p style={{color: tweetTitleColor, display: "inline", margin: "0.3em 0", fontWeight: "bold"}}>@{tweet.postedBy}</p>
                        </Link>
                    }
                </div>
            </Col>

            <Col xs={mobileCol3} lg={1}></Col>
        </Row>

        <Row>
            <Col xs={mobileCol1} lg={1}>
            </Col>

            <Col xs={mobileCol2} lg={10}>
                <Row>
                    <p style={{color: tweetTextColor, marginBottom: "1em", fontWeight: 450, overflow: "auto", overflowWrap: "break-word"}}>
                        {tweet.content}
                    </p>
                </Row>
                <Row style={{display: "grid", placeItems: "center"}}>
                    {imageURL ?
                    <img src={imageURL} style={{padding: "1em 0", borderRadius: "20px", maxHeight: "400px", width: "auto"}} draggable="true"/>
                    :
                    <></>
                    }
                </Row>
            </Col>

            <Col xs={mobileCol3} lg={1}></Col>
        </Row>

        <Row>
            <Col xs={mobileCol1} lg={1}>

            </Col>
            <Col xs={mobileCol2} lg={10}>
                <Row>
                    <Col xs={6}>
                        {/* // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FIX DISPLAY INLINE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                        <Link style={{textDecoration: "inherit", color: "inherit", display: "inline"}}> 
                            <div className="commentButton tweetButton" style={{backgroundColor: tweetButtonBackgroundColor,  fontWeight:"bold"}}>
                                    <i className="bi bi-chat"/>
                                    { comments }
                            </div>
                        </Link>
                    </Col>
                    <Col xs={6}>
                        { liked ? 
                        <div className="buttonLiked tweetButton" onClick={clickButton} style={{backgroundColor: tweetButtonBackgroundColor, fontWeight:"bold"}}>
                            <i className="bi bi-heart-fill"/>
                            { likes }
                        </div>
                        :
                        <div className="buttonNotLiked tweetButton" onClick={clickButton} style={{backgroundColor: tweetButtonBackgroundColor, fontWeight:"bold"}}>
                            <i className="bi bi-heart"/>
                            { likes }
                        </div> }
                    </Col>
                </Row>
            </Col>

            <Col xs={mobileCol3} lg={1}></Col>
        </Row>

    </Container>
    </>)
}