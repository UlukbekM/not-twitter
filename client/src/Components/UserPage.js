import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Axios from 'axios';
import Stack from 'react-bootstrap/Stack'
import { MenuColumn } from "./MenuColumn";
import { useLocation } from 'react-router-dom';
import { Tweet } from './Tweet';
import { Link } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import { Footer } from "./Footer";
import jwt_decode from "jwt-decode";


export const UserPage = (props) => {
    const {backgroundColor, api, fontColor, titleColor, borderColor, tweetBackground, tweetTitleColor, tweetTextColor} = props.theme


    let navigate = useNavigate();
    const location = useLocation();
    const {username} = useParams()

    const [mainUser, setMainUser] = useState("")
    const [user, setUser] = useState([])
    const [tweets, setTweets] = useState([])

    useEffect(() => {
        getUser(window.location.pathname.substring(1,window.location.pathname.length))
    }, [location]);

    const getUser = (name) => {
        Axios.get(`${api}/getUser`, {
            params: {
                username: name
            }
        })
        .then((response)=> {
            // console.log(response.data)
            setUser(response.data)
            setTweets(response.data.tweets)
        })
    }

    useEffect(()=> {
        getUser(username)

        let token = jwt_decode(window.sessionStorage.getItem("token"));
        setMainUser(token.username)
    },[])

    return(<>
        <Container fluid style={{color: fontColor}}>
            <Row style={{display: "flex", justifyContent: "center"}}>
                <MenuColumn backgroundColor={backgroundColor}/>
                
                <Col style={{background: backgroundColor, minHeight: "100vh" , padding: 0, borderLeft: `solid 2px ${borderColor}`, borderRight: `solid 2px ${borderColor}`}} lg={6}>
                    { !user ? 
                    "user doesnt exist"
                    :
                    <>
                    <Stack gap={0} style={{padding: "0.5em 1em"}}>
                        <Row>
                            <Col xs={2} lg={1} className="backIcon" onClick={() => navigate(-1)} style={{display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer",}} >
                                <i className="bi bi-arrow-left" style={{fontSize: "2em"}}/>
                            </Col>
                            <Col xs={4} lg={5}>
                                    <Row>
                                        {user.username? <h4 style={{margin: 0}}>{user.username}</h4>:"temp"}
                                    </Row>
                                    <Row>
                                        {user.tweets ? <p style={{margin: 0}}>{user.tweets.length} Tweets</p> : "temp"}
                                    </Row>
                            </Col>
                            <Col xs={6} lg={6}></Col>
                        </Row>
                    </Stack>

                    <img src="https://wallpapers.com/images/hd/peacock-blue-plain-color-9bxl0kw0vw849lpd.jpg" className="profileBanner"/>

                    <Stack  style={{padding: "1em"}}>
                        <div style={{marginTop: "-60px"}}>
                            <img src="https://img.icons8.com/external-becris-lineal-becris/256/external-user-mintab-for-ios-becris-lineal-becris.png"
                            // className="profilePicture"
                            style={{color: titleColor, width: "85px", height: "85px", padding: "5px", backgroundColor: backgroundColor, borderRadius: "50px"}}
                            />
                            {/* <i className="bi bi-person-circle" style={{color: titleColor, width: "85px", height: "85px"}} /> */}
                        </div>

                        <Row>
                            <Col>
                                {user.username? <h2>{user.username}</h2>:<></>}
                            </Col>
                            
                            <Col>
                            </Col>

                            <Col>
                                { username == mainUser ? 
                                <button> Edit </button> :
                                <button> Unfollow </button>
                                }
                            </Col>
                        </Row>
                        {/* {user.tweets ? <h5>{user.tweets.length} Tweets</h5> : "temp"} */}
                        <p>Description</p>
                        <Row>
                            <Col xs={4} lg={2}>
                                {user.following?
                                    <Link to="following" className="userFollow">
                                        <p style={{display: "inline"}}>{user.following.length} following</p>
                                    </Link>:<></>}
                            </Col>
                            <Col xs={4} lg={2}>
                                {user.followers?
                                    <Link to="followers" className="userFollow">
                                            <p style={{display: "inline"}}>{user.followers.length} followers</p>
                                    </Link>:<></>}
                            </Col>
                            <Col xs={4} lg={8}></Col>
                        </Row>


                        <Row style={{paddingTop: "2em"}}>
                            <Col>
                                Tweets
                            </Col>
                            {/* <Col>
                                Likes
                            </Col> */}
                        </Row>

                    </Stack>
                    <Row style={{borderBottom: "2px solid black", width: "100%", margin: 0}}></Row>

                    <Container>
                        {tweets.length > 0 &&
                            tweets.map((tweet) => (
                                <Tweet {...tweet} key={tweet._id} username={username} tweetBackground={tweetBackground} tweetTitleColor={tweetTitleColor} tweetTextColor={tweetTextColor}/>
                        ))}
                    </Container>
                    </>
                    }
                </Col>

                <Col style={{background: backgroundColor, position: "fixed", right: 0, minHeight: "100vh"}} className="mobileCol" lg={3}>
                    
                </Col>
            </Row>
        </Container>

        <Footer username={user.username}/>
    </>)
}