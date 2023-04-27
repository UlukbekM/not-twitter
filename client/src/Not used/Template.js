import React, {useEffect, useState} from 'react'
import { Footer } from './Footer'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MenuColumn } from "./MenuColumn";
import jwt_decode from "jwt-decode";
import { TweetForm } from './TweetForm';
import Modal from 'react-bootstrap/Modal';

export const Search = (props) => {    
    const {paragraphColor, contentBackgroundColor, backgroundColor, api, fontColor, titleColor, borderColor, tweetBackground, tweetTitleColor, tweetTextColor, tweetButtonBackgroundColor, tweetButtonColor} = props.theme

    const [user, setUser] = useState("")

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {setShow(true)};

    useEffect(() => {
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
                
                <Col style={{background: backgroundColor, minHeight: "100vh" , padding: 0, borderLeft: `solid 2px ${borderColor}`, borderRight: `solid 2px ${borderColor}`, }} lg={6}>


                </Col>

                <Col style={{background: backgroundColor, position: "fixed", right: 0, minHeight: "100vh"}} className="mobileCol" lg={3}/>
            </Row>
        </Container>

        <Footer/>
    </>)
}