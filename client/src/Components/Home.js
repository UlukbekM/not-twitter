import React, {useEffect, useState} from 'react'
import jwt_decode from "jwt-decode";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Axios from 'axios';
import { SuggestedUsers } from './SuggestedUsers';
import { Tweet } from './Tweet';
import { MenuColumn } from "./MenuColumn";
import Stack from 'react-bootstrap/Stack'
import { Footer } from './Footer';
import Form from 'react-bootstrap/Form'
import { TweetForm } from './TweetForm';
import Modal from 'react-bootstrap/Modal';



export const Home = (props) => {
    const {contentBackgroundColor, backgroundColor, api, fontColor, titleColor, borderColor, tweetBackground, tweetTitleColor, tweetTextColor, tweetButtonBackgroundColor, tweetButtonColor} = props.theme

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        console.log('test')
        setShow(true)};

    const [user, setUser] = useState("");
    const [suggestedUsers, setSuggestedUsers] = useState([])
    const [userFeed, setUserFeed] = useState([])

    const getSuggestedUsers = (username) => {
        Axios.get(`${api}/suggestedUsers`, {
            params: {
                username: username
            }
        })
        .then((response)=> {
            setSuggestedUsers(response.data)
        })
    }

    const getFeed = (name) => {
        Axios.get(`${api}/getTweets`, {
            params: {
                username: name
            }
        })
        .then((response)=> {
            console.log(response.data)
            // response.data.tweetArray.sort((a,b) => new Date(b.date) - new Date(a.date))
            // setUserFeed(response.data.tweetArray)
            // setUserImages(response.data.profileArray)
            // console.log(response)
            response.data.sort((a,b) => new Date(b.date) - new Date(a.date))
            setUserFeed(response.data)
        })
    }

    useEffect(()=> {
        let token = window.sessionStorage.getItem("token");
        if(token === null) {
            window.location = "/landing"
        }
        

        let decoded = jwt_decode(token);
        setUser(decoded)
        getSuggestedUsers(decoded.username)
        getFeed(decoded.username)
        // console.log(decoded)
        // let currentUnix = Math.round(Date.now()/1000)

        // console.log(decoded.exp,currentUnix)
        // if(currentUnix > decoded.exp) {
        //     refreshToken(token)
        // }
    },[])

    // const refreshToken = () => {

    // }

    const logout = () => {
        sessionStorage.removeItem('token');
        window.location.reload();
    }


    return(<>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Tweet</Modal.Title>
            </Modal.Header>


            <Modal.Body>
                <TweetForm theme={props.theme} user={user.username} getFeed={()=>getFeed(user.username)}/>
            </Modal.Body>
            
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>

        <Container fluid style={{color: fontColor}}>
            <Row style={{display: "flex", justifyContent: "center"}}>
                <MenuColumn theme={props.theme} handleShow={()=>handleShow()}/>

                <Col style={{background: backgroundColor, minHeight: "100vh", borderLeft: `solid 2px ${borderColor}`, borderRight: `solid 2px ${borderColor}`}} lg={6}>
                    <Row>
                        <h2 style={{color: titleColor}}>Home</h2>
                    </Row>
                    <Row style={{textAlign:"center", borderBottom: `solid 2px ${borderColor}`}}>
                        <h4 style={{color: titleColor}}>Feed</h4>
                    </Row>


                    {/* <Row style={{margin: "0"}}>
                        <Col xs={9} lg={10}>
                            <Form.Control
                                type="text"
                                placeholder="What's Happening?"
                                maxLength="280"
                                value={tweet}
                                onChange={({ target }) => setTweet(target.value)}
                                rows={3}
                            />
                        </Col>
                        <Col xs={2} lg={2} style={{textAlign: "center"}}>
                            <Button variant="primary" onClick={sendTweet} disabled={!(tweet !== "")}>Tweet</Button>
                        </Col>
                    </Row> */}

                <TweetForm theme={props.theme} user={user.username} getFeed={()=>getFeed(user.username)}/>

                <Row style={{borderBottom: `solid 2px ${borderColor}`}}/>

                    <Container>
                    {userFeed.length > 0 &&
                        userFeed.map((tweet) => (
                            <Tweet {...tweet} key={tweet._id} username={user.username} 
                            tweetBackground={tweetBackground} 
                            tweetTitleColor={tweetTitleColor} 
                            tweetTextColor={tweetTextColor}
                            tweetButtonBackgroundColor={tweetButtonBackgroundColor}
                            tweetButtonColor={tweetButtonColor}
                            // userPictures={userImages}
                            />
                    ))}
                    </Container>
                </Col>

                <Col style={{background: backgroundColor, position: "fixed", right: 0, minHeight: "100vh",}} className="mobileCol" lg={3}>
                    <Container style={{background: contentBackgroundColor, borderRadius: "20px", marginTop: "10%", padding: "1em", color: fontColor}}>
                        <Row><h3>Who to follow</h3></Row>
                        {suggestedUsers.length > 0 &&
                            suggestedUsers.map((tempUser) => (
                                <SuggestedUsers key={tempUser.email} {...tempUser} currentUser={user.username} fontColor={fontColor}/>
                        ))}
                    </Container>
                    <Button variant="primary" onClick={logout} style={{marginTop: "10%"}}>Log Out</Button>
                </Col>
            </Row>
        </Container>

        <Footer username={user.username}/>
    </>)
}