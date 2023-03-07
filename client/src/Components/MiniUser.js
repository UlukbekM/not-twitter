import React,{useEffect, useState} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";
import Axios from 'axios';

export const MiniUser = (user) => {
    const [status, setStatus] = useState(false)
    // console.log(user)

    const api = 'http://localhost:3001'

    useEffect(() => {
        if(user.array) {
            // console.log(user)
            if(user.array.some(e => e.username === user.username)) {
                setStatus(true)
            }
        }
    } ,[user.array])

    const followUser = () => {
        // let token = window.sessionStorage.getItem("token");
        console.log(user.mainUser + " will follow " + user.username)
        Axios.put(`${api}/followUser`, {
            follower: user.mainUser,
            following: user.username,
            // token: token
        }).then((response)=> {
            if(response.data === "user followed") {
                setStatus(!status)
            }
        })
    }

    const unfollowUser = () => {
        // let token = window.sessionStorage.getItem("token");
        console.log(user.mainUser + " will unfollow " + user.username)
        Axios.put(`${api}/unfollowUser`, {
            unfollower: user.mainUser,
            target: user.username,
            // token: token
        }).then((response)=> {
            if(response.data === "user unfollowed") {
                setStatus(!status)
            }
        })
    }

    return(<>
        <Row style={{background: "#fffffe", width: "95%", padding: "0.2em", borderRadius: "5px", alignItems: "center"}}>
            <Col xs={2} lg={1}>
                <Link to={"../../" + user.username} className="userFollow" style={{padding: 0}}>
                    <img src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png" style={{width: "2rem", height: "2rem"}}/>
                </Link>
            </Col>

            <Col xs={6} lg={9}>
                <Row style={{fontWeight: "bold", display: "inline"}}>
                    <Link to={"../../" + user.username} className="userFollow" style={{padding: 0}}>
                        {user.username}
                    </Link>
                </Row>
                <Row>
                    Description...
                </Row>
            </Col>

            <Col xs={4} lg={2} style={{textAlign: "center"}}>
                { user.mainUser !== user.username ? <>
                {status ? 
                    <button className="unfollowButton" onClick={unfollowUser}> <span> Following </span> </button>
                    :
                    <button className="followButton" onClick={followUser}> Follow </button>
                }
                </>
                :<></>}
            </Col>
        </Row>
    </>)
}