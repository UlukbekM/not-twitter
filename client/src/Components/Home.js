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


export const Home = (props) => {
    const {backgroundColor, api, fontColor, titleColor, borderColor, tweetBackground, tweetTitleColor, tweetTextColor, tweetButtonBackgroundColor, tweetButtonColor} = props.theme

    const [user, setUser] = useState("");
    const [suggestedUsers, setSuggestedUsers] = useState([])
    const [userFeed, setUserFeed] = useState([])
    const [tweet, setTweet] = useState("")

    const [image, setImage] = useState(null)

    const handleImage = e => {
        if(e.target.files[0].size > 2097152) {
            alert("File is too big!")
            setImage(null)
        } else {
            setImage(e.target.files[0])
            document.getElementById("tweetImageContainer").style.backgroundImage=`url(${window.URL.createObjectURL(e.target.files[0])})`
            document.getElementById("tweetImage").src=window.URL.createObjectURL(e.target.files[0])
        }
    }

    const removeImage = () => {
        setImage(null)
    }

    useEffect(()=> {
        if(image) {
            document.getElementById("tweetImageContainer").style.display = "block"
        } else {
            document.getElementById("tweetImageContainer").style.display = "none"
        }
    },[image])


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
        <Container fluid style={{color: fontColor}}>
            <Row style={{display: "flex", justifyContent: "center"}}>
                <MenuColumn backgroundColor={backgroundColor} titleColor={titleColor}/>

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

                <Container style={{paddingTop: "1em",paddingBottom: "1em"}}>
                    <Row style={{height:"auto"}}>
                        {/* <Form.Control
                            size='lg'
                            type="text"
                            placeholder="What's Happening?"
                            maxLength="280"
                            value={tweet}
                            onChange={({ target }) => setTweet(target.value)}
                            rows={3}
                            style={{backgroundColor: backgroundColor, border: "none", color: fontColor, outline: "none"}}
                        /> */}
                        {/* <input placeholder="What's Happening?" className='tweetForm' 
                            style={{
                            backgroundColor: backgroundColor, 
                            // border: "none", 
                            color: fontColor, 
                            outline: "none", 
                            fontFamily: "inherit",
                            paddingTop: "1em",
                            paddingBottom: "1em"
                            }}/> */}
                        <textarea placeholder="What's Happening?" className='tweetForm'
                            maxLength={280}
                            value={tweet}
                            onChange={({ target }) => setTweet(target.value)}
                            style={{        
                                resize: "none",
                                height: "auto",                    
                                backgroundColor: backgroundColor, 
                                border: "none", 
                                color: fontColor, 
                                outline: "none", 
                                fontFamily: "inherit",
                                paddingTop: "1em",
                                paddingBottom: "1em",
                                overflow: "hidden"}}
                        ></textarea>
                        {/* <div style={{width: "100%"}}>
                            <button style={{ position: "relative",top: "10px", left: "10px"}}>X</button>
                            <img src="#" id="tweetImage" style={{paddingTop: "1em", borderRadius: "30px", maxWidth: "100%"}}/>
                        </div> */}
                                                                                                                            {/*  ~~~~~~~~~~~~~~~~~~~~~~~~ FIX WITH SMALL IMGS ~~~~~~~~~~~~~~ */}
                        <div style={{width: "100%", height: "100%", backgroundSize: "cover", borderRadius: "20px"}} id="tweetImageContainer">
                            <button className='tweetImageClose' onClick={removeImage}>
                                <p style={{margin: 0}}>X</p>
                            </button>
                            <img src="#" id="tweetImage" style={{paddingTop: "1em", borderRadius: "30px", maxWidth: "100%", opacity: 0}}/>
                        </div>
                    </Row>
                    <Row style={{paddingTop: "1em"}}>
                        <Col xs={1} lg={1} style={{display: "grid", placeItems: "center"}}>
                            {/* <Container> */}
                            <label htmlFor="image-upload">
                                <i className="bi bi-card-image" style={{fontSize: "1.3em", cursor: "pointer"}}/>
                            </label>
                            <input type="file" accept='image/*' onChange={handleImage} id="image-upload" style={{display: "none"}}/>
                            {/* </Container> */}
                        </Col>
                        <Col xs={8}lg={10}>
                        </Col>
                        <Col xs={2} lg={1} style={{alignItems: "center"}}>
                            <Button variant="primary" onClick={sendTweet} disabled={!(tweet !== "")}>Tweet</Button>
                        </Col>
                        
                    </Row>
                </Container>

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
                            />
                    ))}
                    </Container>
                </Col>

                <Col style={{background: backgroundColor, position: "fixed", right: 0, minHeight: "100vh",}} className="mobileCol" lg={3}>
                    <Container style={{background: backgroundColor, borderRadius: "5px", marginTop: "10%", padding: "1em"}}>
                        <Row><h3>Who to follow</h3></Row>
                        {suggestedUsers.length > 0 &&
                            suggestedUsers.map((tempUser) => (
                                <SuggestedUsers key={tempUser.email} {...tempUser} currentUser={user.username} />
                        ))}
                    </Container>
                    <Button variant="primary" onClick={logout} style={{marginTop: "10%"}}>Log Out</Button>
                </Col>
            </Row>
        </Container>

        <Footer username={user.username}/>
    </>)
}