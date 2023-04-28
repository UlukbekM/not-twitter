import React, {useEffect, useState} from 'react'
import { Footer } from './Footer'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MenuColumn } from "./MenuColumn";
import jwt_decode from "jwt-decode";
import { TweetForm } from './TweetForm';
import Modal from 'react-bootstrap/Modal';
import Axios from 'axios';
import { SuggestedUsers } from './SuggestedUsers';

export const People = (props) => {    
    const {paragraphColor, contentBackgroundColor, backgroundColor, api, fontColor, titleColor, borderColor, tweetBackground, tweetTitleColor, tweetTextColor, tweetButtonBackgroundColor, tweetButtonColor} = props.theme

    const [user, setUser] = useState("")
    const [suggestedUsers, setSuggestedUsers] = useState([])

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {setShow(true)};

    useEffect(() => {
        let token = jwt_decode(window.sessionStorage.getItem("token"));
        setUser(token.username)
        getSuggestedUsers(token.username)
    },[])

    const getSuggestedUsers = (username) => {
        Axios.get(`${api}/suggestedUsers`, {
            params: {
                username: username
            }
        })
        .then((response)=> {
            setSuggestedUsers(response.data)
            console.log(response.data)
        })
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

                    {/* <Container style={{background: contentBackgroundColor, borderRadius: "20px", marginTop: "10%", padding: "1em", color: fontColor}}> */}
                    <div style={{marginTop:"2em", textAlign: "center"}}>
                        <Row><h3>Who to follow</h3></Row>
                            {suggestedUsers.length > 0 &&
                                suggestedUsers.map((tempUser) => (
                                    <SuggestedUsers key={tempUser.email} {...tempUser} currentUser={user.username} theme={props.theme}/>
                            ))}
                    </div>

                    {/* </Container> */}

                </Col>

                <Col style={{background: backgroundColor, position: "fixed", right: 0, minHeight: "100vh"}} className="mobileCol" lg={3}/>
            </Row>
        </Container>

        <Footer theme={props.theme}/>
    </>)
}