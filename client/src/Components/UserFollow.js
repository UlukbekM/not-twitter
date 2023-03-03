import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Axios from 'axios';
import { MenuColumn } from "./MenuColumn";
import Stack from 'react-bootstrap/Stack'
import { Link } from "react-router-dom";
import { MiniUser } from "./MiniUser";
import { useNavigate} from "react-router-dom";
import { Footer } from "./Footer";
import jwt_decode from "jwt-decode";

const color = "#000"
const colorBg = "#232946"
const colorMain = "#eebbc3"
const colorSide = "#b8c1ec" 

export const UserFollow = () => {
    let navigate = useNavigate();
    const location = useLocation();
    const {username} = useParams()
    const [user, setUser] = useState([])
    const [page, setPage] = useState("")

    const [mainUser, setMainUser] = useState([])


    const api = 'http://localhost:3001'

    const getProfileUser = (name) => {
        Axios.get(`${api}/getUser`, {
            params: {
                username: name
            }
        })
        .then((response)=> {
            // console.log(response.data)
            setUser(response.data)
        })
    }

    const getMainUser = () => {
        let decoded = jwt_decode(window.sessionStorage.getItem("token"));
        Axios.get(`${api}/getUser`, {
            params: {
                username: decoded.username
            }
        })
        .then((response)=> {
            // console.log(response.data)
            setMainUser(response.data)
        })
    }

    // const checkItem = async (username) => {
    //     let temp = await mainUser.following.some(e => e.username == username)
    //     // console.log(temp)
    //     // return false
    //     if(temp){
    //         return true
    //     } else {
    //         return false
    //     }
    // }


    useEffect(() => {
        if(location.pathname.includes("followers")){
            setPage("followers")
        } else if (location.pathname.includes("following")) {
            setPage("following")
        } else {
            setPage("")
        }
    }, [location]);

    useEffect(()=> {
        getProfileUser(username)
        getMainUser()
    },[])


    return(<>
        <Container fluid style={{color: color}}>
            <Row style={{display: "flex", justifyContent: "center"}}>
                <MenuColumn/>
                
                <Col style={{background: colorMain, minHeight: "100vh", padding: 0 }} lg={6}>
                    { !user ? 
                    "user doesnt exist"
                    :
                    <>
                        <Stack gap={4} style={{padding: "0.5em 1em"}}>
                            {user.username? 
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
                            :<></>}
                            <Row style={{fontWeight: "bold", textAlign: "center"}}>
                                <Col>
                                    { page == "followers" ? 
                                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center",  alignItems: "center"}}>
                                        <p style={{color: "#fff", cursor: "pointer", fontSize: "18px", marginBottom: "0.2em"}}>
                                            Followers
                                        </p>
                                        <div style={{height: "1px", color: "black", width: "25%", border: "2px solid rgb(29, 155, 240)",borderRadius: "10px"}}></div>
                                    </div>
                                    : 
                                    <Link to="./../followers" style={{textDecoration: "none", color: "inherit", fontSize: "18px"}}>
                                        Followers
                                    </Link>
                                    }
                                </Col>
                                <Col>
                                    { page == "following" ? 
                                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center",  alignItems: "center"}}>
                                        <p style={{color: "#fff", cursor: "pointer", fontSize: "18px", marginBottom: "0.2em"}}>
                                            Following
                                        </p>
                                        <div style={{height: "1px", color: "black", width: "25%", border: "2px solid rgb(29, 155, 240)",borderRadius: "10px"}}></div>
                                    </div>
                                    : 
                                    <Link to="./../following" style={{textDecoration: "none", color: "inherit", fontSize: "18px"}}>
                                        Following
                                    </Link>
                                    }
                                </Col>
                            </Row>
                        </Stack>
                        <div style={{borderBottom: "3px solid black", width: "110%", marginBottom: "1em"}}></div>



                        {/* <MiniUser {...item} key={item._id} status={checkItem("following",item.username)}/>))} */}

                        { user.following && page == "following"
                            ? <Stack gap={2} style={{padding: "0.5em 1em", alignItems: "center"}}>
                                {user.following.length > 0 &&
                                user.following.map((item) => (
                                    <MiniUser {...item} key={item._id} array={mainUser.following}/>))}
                            </Stack> 
                        :<></> }
                        
                        { user.followers && page == "followers"
                            ? <Stack gap={2} style={{padding: "0.5em 1em", alignItems: "center"}}>
                                {user.followers.length > 0 &&
                                user.followers.map((item) => (
                                    <MiniUser {...item} key={item._id} array={mainUser.following}/>))}
                            </Stack>
                        :<></> }
                    </>
                    }
                </Col>

                <Col style={{background: colorBg, position: "fixed", right: 0, minHeight: "100vh"}} className="mobileCol" lg={3}>
                    
                </Col>
            </Row>
        </Container>
        <Footer username={user.username}/>
    </>)
}