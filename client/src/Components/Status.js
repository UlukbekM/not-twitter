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

export const Status = (props) => {
    let {username, id} = useParams()
    let navigate = useNavigate();

    const {contentBackgroundColor, backgroundColor, api, fontColor, titleColor, borderColor, tweetBackground, tweetTitleColor, tweetTextColor, tweetButtonBackgroundColor, tweetButtonColor} = props.theme
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {setShow(true)};
    
    const [user, setUser] = useState("")
    const [tweet, setTweet] = useState([])

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
        })

        let token = jwt_decode(window.sessionStorage.getItem("token"));
        setUser(token.username)
    },[])

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
                
                <Col style={{background: backgroundColor, minHeight: "100vh" , padding: 0, borderLeft: `solid 2px ${borderColor}`, borderRight: `solid 2px ${borderColor}`}} lg={6}>
                    

                    
                    <Stack gap={4} style={{padding: "0.5em 1em"}}>
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

                        <Row>
                            <Col>
                                {tweet.userImage? 
                                <img src={tweet.userImage} style={{width: "50px", height: "50px", borderRadius: "50%"}}/>:
                                <img src="https://img.icons8.com/external-becris-lineal-becris/256/external-user-mintab-for-ios-becris-lineal-becris.png"/>
                                }
                            </Col>

                            <Col>
                                @{tweet && tweet.postedBy}
                            </Col>

                            <Col>
                            
                            </Col>
                        </Row>

                        <Row>
                            {tweet && tweet.content}
                        </Row>

                        <Row>
                            {tweet && tweet.date}
                        </Row>

                        <Row>
                            {tweet ? tweet.likes.length : 0} Likes
                        </Row>

                        <Row>
                            ICONS HERE
                        </Row>
                    </Stack>


                </Col>

                <Col style={{background: backgroundColor, position: "fixed", right: 0, minHeight: "100vh"}} className="mobileCol" lg={3}>
                    
                </Col>
            </Row>
        </Container>

        <Footer username={user}/>

    </>)
}