import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { TweetForm } from './TweetForm';
import { MenuColumn } from "./MenuColumn";
import { Footer } from './Footer';
import jwt_decode from "jwt-decode";
import Stack from 'react-bootstrap/Stack'
import { useNavigate} from "react-router-dom";
import { Link } from "react-router-dom";

export const Status = (props) => {
    let {username, id} = useParams()
    let navigate = useNavigate();

    const {paragraphColor, contentBackgroundColor, backgroundColor, api, fontColor, titleColor, borderColor, tweetBackground, tweetTitleColor, tweetTextColor, tweetButtonBackgroundColor, tweetButtonColor} = props.theme
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {setShow(true)};
    
    const [user, setUser] = useState("")
    const [tweet, setTweet] = useState([])
    const [likes, setLikes] = useState(0)
    const [date, setDate] = useState("")
    const [liked, setLiked] = useState(false)
    const [comments, setComments] = useState(0)

    useEffect(() => {
        Axios.get(`${api}/getTweetInfo`, {
            params: {
                username: username,
                id: id
            }
        })
        .then((response)=> {
            console.log(response.data)
            setTweet(response.data)
            setLikes(response.data.likes.length)
            // let temp = new Date(response.data.date)
            convertTime(response.data.date)
            // console.log(temp.getHours())
        })

        let token = jwt_decode(window.sessionStorage.getItem("token"));
        setUser(token.username)
    },[])

    const convertTime = (item) => {
        let time = new Date(item)
        let hours = time.getHours()
        let minutes = time.getMinutes()
        let month = time.toLocaleString('default', { month: 'long' })
        let date = time.getDate()
        let year = time.getFullYear()
        let ampm

        console.log()

        if(hours > 11) {
            ampm = 'PM'
            hours = hours-12
        } else {
            ampm = 'AM'
        }

        setDate(hours + ":" + minutes + " " + ampm + " · " + month + " " + date + ", " + year)
    }

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
    
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Tweet</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <TweetForm theme={props.theme} user={user.username} mode="modal" handleClose={()=>handleClose()}/>
            </Modal.Body>
        </Modal>



        <Container fluid style={{color: fontColor}}>
            <Row style={{display: "flex", justifyContent: "center"}}>
                <MenuColumn theme={props.theme} handleShow={()=>handleShow()}/>
                
                <Col style={{background: backgroundColor, minHeight: "100vh" , padding: 0, borderLeft: `solid 2px ${borderColor}`, borderRight: `solid 2px ${borderColor}`, }} lg={6}>
                    
                    {tweet ? 
                    <Stack gap={0} style={{padding: "0.5em 1em"}}>

                        <Container style={{marginBottom: "1em"}}>
                            <Row style={{alignItems: "center"}}>
                                <Col xs={2} lg={1} className="backIcon" onClick={() => navigate(-1)} style={{display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer",}} >
                                    <i className="bi bi-arrow-left" style={{fontSize: "2em"}}/>
                                </Col>
                                <Col xs={4} lg={5}>
                                    <h4 style={{margin: 0}}>
                                        Thread
                                    </h4>
                                </Col>
                                <Col xs={6} lg={6}></Col>
                            </Row>
                        </Container>

                        <Container style={{marginBottom: "1em"}}>
                            <Row style={{alignItems: "center"}}>
                                <Col lg={1} style={{textAlign: "center"}}>
                                    <Link to={"../../" + tweet.postedBy} className="userFollow">
                                        {tweet.userImage? 
                                        <img src={tweet.userImage} style={{width: "50px", height: "50px", borderRadius: "50%"}}/>:
                                        <img src="https://img.icons8.com/external-becris-lineal-becris/256/external-user-mintab-for-ios-becris-lineal-becris.png"/>
                                        }
                                    </Link>
                                </Col>

                                <Col lg={8} style={{fontWeight: "600", fontSize: "22px"}}>
                                    @{tweet && tweet.postedBy}
                                </Col>

                                <Col lg={3} style={{textAlign: "right"}}>
                                    Dropdown
                                </Col>
                            </Row>
                        </Container>

                        <Container style={{wordBreak: "break-all",marginBottom: "1em"}}>
                            {tweet && tweet.content}
                        </Container>

                        <Container style={{color: paragraphColor, borderBottom: "1px black solid",marginBottom: "1em"}}>
                            {date}
                        </Container>

                        <Container style={{display: "flex", borderBottom: "1px black solid",marginBottom: "1em"}}>
                            <p style={{color: fontColor, margin: 0, width: "auto", padding: "3px 3px 3px 0", fontWeight: "bold"}}>{likes}</p>
                            <p style={{color: paragraphColor, margin: 0, width: "auto", padding: "3px"}}>{likes == 1 ? "Like": "Likes"}</p>
                        </Container>

                        <Container style={{marginBottom: "0.5em"}}>
                            <Row style={{borderBottom: "1px black solid", textAlign: "center"}}>
                                <Col>
                                
                                    <div className="commentButtonStatus tweetIcon iconEffect">
                                        <i className="bi bi-chat"/>
                                        {/* <i className="bi bi-chat-fill"></i> */}
                                        { comments }
                                    </div>
                                </Col>

                                <Col>
                                { liked ? 
                                    <div className="buttonLikedStatus tweetIcon iconEffect" onClick={clickButton}>
                                        <i className="bi bi-heart-fill"/>
                                        { likes }
                                    </div>
                                    :
                                    <div className="buttonNotLikedStatus tweetIcon iconEffect" onClick={clickButton}>
                                        <i className="bi bi-heart"/>
                                        { likes }
                                    </div> 
                                }
                                </Col>
                            </Row>
                        </Container>
                    </Stack> : <></>}
                    

                    


                </Col>

                <Col style={{background: backgroundColor, position: "fixed", right: 0, minHeight: "100vh"}} className="mobileCol" lg={3}>
                    
                </Col>
            </Row>
        </Container>

        <Footer username={user}/>

    </>)
}