import React, {useState, useEffect} from "react";
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Axios from 'axios';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';

export const Tweet = (tweet) => {
    const {tweetBackground , tweetTitleColor, tweetTextColor, tweetButtonBackgroundColor, tweetButtonColor} = tweet
    const location = useLocation();
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(0)
    const [comments, setComments] = useState(0)
    const [ownPage, setOwnPage] = useState(false)
    const [imageURL, setImageURL] = useState("")

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


        <Row>
            <Col xs={2} lg={1} style={{display: "flex", textAlign: "center", justifyContent: "center"}}>
                <Link to={tweet.postedBy} className="userFollow">
                    <i className="bi bi-person-circle" style={{fontSize: "2rem", color: tweetTitleColor}}></i>
                </Link>
            </Col>

            <Col xs={10} lg={11} style={{display: "flex", alignItems: "center"}}>
                <div style={{color: tweetTitleColor}}>
                    {ownPage ? 
                    <p style={{color: tweetTitleColor, cursor: "pointer",display: "inline", margin: "0.3em 0", fontWeight: "bold"}}>@{tweet.postedBy}</p> : 
                    <Link to={tweet.postedBy} className="userFollow">
                        <p style={{color: tweetTitleColor, display: "inline", margin: "0.3em 0", fontWeight: "bold"}}>@{tweet.postedBy}</p>
                    </Link> }
                </div>
            </Col>
        </Row>

        <Row>
            <Col xs={0} lg={1}>
            </Col>

            <Col xs={12} lg={11}>
                <Row>
                    <p style={{color: tweetTextColor, marginBottom: "1em", fontWeight: 450, overflow: "auto", overflowWrap: "break-word"}}>
                        {tweet.content}
                    </p>
                </Row>
                <Row style={{display: "grid", placeItems: "center"}}>
                    {imageURL ?
                    <img src={imageURL} style={{padding: "1em 0", maxWidth: "500px"}}/> :
                    <></>
                    }
                </Row>
            </Col>
        </Row>

        <Row>
            <Col xs={0} lg={1}>

            </Col>
            <Col xs={12} lg={11}>
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
        </Row>

    </Container>
    </>)
}