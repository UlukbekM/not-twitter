import React, {useState, useEffect} from "react";
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Axios from 'axios';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';

export const Tweet = (tweet) => {
    const {tweetBackground , tweetTitleColor, tweetTextColor} = tweet
    const location = useLocation();
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(0)
    const [ownPage, setOwnPage] = useState(false)

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
        if(tweet.likes.includes(tweet.username)) {
            setLiked(true)
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
    <Container style={{backgroundColor: tweetBackground, margin: "1em 0", borderRadius: "5px", color: tweetTextColor}} lg={10}>
        <Row>
            <Col xs={2} lg={1} style={{display: "flex", alignItems:"center", justifyContent:"center", padding: 0}}>
                <Link to={tweet.postedBy} className="userFollow">
                    {/* <img src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png" style={{width: "2rem", height: "2rem"}}/> */}
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
        </Row>
    </Container>
    </>)
}