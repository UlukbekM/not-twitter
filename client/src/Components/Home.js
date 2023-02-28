import React, {useEffect, useState} from 'react'
import jwt_decode from "jwt-decode";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Axios from 'axios';
import { SuggestedUsers } from './SuggestedUsers';
import { Tweet } from './Tweet';
import { MenuColumn } from "./MenuColumn";
import { Footer } from './Footer';

const color = "#000"
const colorBg = "#232946"
const colorMain = "#eebbc3"
const colorSide = "#b8c1ec" 




export const Home = () => {
    const [user, setUser] = useState("");
    const [suggestedUsers, setSuggestedUsers] = useState([])
    const [userFeed, setUserFeed] = useState([])

    const [tweet, setTweet] = useState("")

    const api = 'http://localhost:3001'

    const getSuggestedUsers = (username) => {
        Axios.get(`${api}/suggestedUsers`, {
            params: {
                username: username
            }
        })
        .then((response)=> {
            setSuggestedUsers(response.data)
            // console.log(response.data)
        })
    }

    const getFeed = (name) => {
        Axios.get(`${api}/getTweets`, {
            params: {
                username: name
            }
        })
        .then((response)=> {
            console.log(response)
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

    const sendTweet = async e => {
        e.preventDefault()
        // console.log(user)
        let token = window.sessionStorage.getItem("token");
        Axios.post(`${api}/newTweet`, {
            username: user.username,
            tweet: tweet,
            token: token
        }).then((response)=> {
            console.log(response)
            getFeed(user.username)
        })
        setTweet("")
    }

    return(<>
        <Container fluid style={{color: color}}>
            <Row style={{display: "flex", justifyContent: "center"}}>
                <MenuColumn/>

                <Col style={{background: colorMain, minHeight: "100vh"}} lg={6}>
                    <Row>
                        <h2>Home</h2>
                    </Row>
                    <Row style={{textAlign:"center", borderBottom: "solid 2px" , marginBottom: "1em"}}>
                        <h4>Feed</h4>
                    </Row>
                    <Row style={{margin: "0"}}>
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
                        <Col xs={2} lg={2}>
                            <Button variant="primary" onClick={sendTweet} disabled={!(tweet !== "")}>Tweet</Button>
                        </Col>
                    </Row>

                    {/* TWEETS GO HERE */}

                    {userFeed.length > 0 &&
                        userFeed.map((tweet) => (
                            <Tweet {...tweet} key={tweet._id} username={user.username}/>
                    ))}
                </Col>

                <Col style={{background: colorBg, position: "fixed", right: 0, minHeight: "100vh",}} className="mobileCol" lg={3}>
                    <Container style={{background: colorSide, borderRadius: "5px", marginTop: "10%", padding: "1em"}}>
                        <Row><h3>Who to follow</h3></Row>
                        {suggestedUsers.length > 0 &&
                            suggestedUsers.map((tempUser) => (
                                <SuggestedUsers key={tempUser.email} {...tempUser} currentUser={user.username}/>
                        ))}
                    </Container>
                    <Button variant="primary" onClick={logout} style={{marginTop: "10%"}}>Log Out</Button>
                </Col>
            </Row>
        </Container>

        <Footer username={user.username}/>
    </>)
}