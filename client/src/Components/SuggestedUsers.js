import React, {useState} from "react";
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image'
import Axios from 'axios';
import { Link } from "react-router-dom";

export const SuggestedUsers = (user) => {
    const { currentUser, email, username } = user
    const [text, setText] = useState("Follow")

    const [status, setStatus] = useState(false)

    const api = 'http://localhost:3001'

    const followUser = () => {
        Axios.put(`${api}/followUser`, {
            follower: currentUser,
            following: username
        }).then((response)=> {
            if(response.data === "user followed") {
                setStatus(!status)
            }
        })
    }

    const unfollowUser = () => {
        Axios.put(`${api}/unfollowUser`, {
            unfollower: currentUser,
            target: username,
            // token: token
        }).then((response)=> {
            if(response.data === "user unfollowed") {
                setStatus(!status)
            }
        })
    }

    return (<>
        <Row style={{
            // backgroundColor: "#61657a", 
            margin: "1em", borderRadius:"5px", display:"table"}}>
            <Col lg={1} style={{display: "table-cell"}}>
                <Link to={username} className="userFollow" style={{padding: 0}}>
                    <i className="bi bi-person-circle" style={{fontSize: "2rem"}}></i>
                </Link>
            </Col>
            <Col lg={5} style={{display: "table-cell", verticalAlign: "middle"}}>
                <h4 style={{margin: "0"}}>
                    <Link to={username} className="userFollow" style={{padding: 0}}>
                        @{username}
                    </Link>
                </h4>
            </Col>
            <Col lg={2} style={{display: "table-cell", verticalAlign:"middle"}}>
                { status ? 
                <Button variant="light" onClick={unfollowUser} style={{borderRadius: "20px", padding: "5px 15px"}} > Unfollow </Button> :
                <Button variant="light" onClick={followUser} style={{borderRadius: "20px", padding: "5px 15px"}} > Follow </Button>
                }

                {/* <Button variant="light" onClick={followUser} style={{borderRadius: "20px", padding: "5px 15px"}} disabled={text !== "Follow"}> {text} </Button> */}
            </Col>
        </Row>
    </>)
}