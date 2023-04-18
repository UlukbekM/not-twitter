import React, {useState} from "react";
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Axios from 'axios';
import { Link } from "react-router-dom";

export const SuggestedUsers = (user) => {
    const { currentUser, email, username, profilePicture  } = user
    const {api, fontColor} = user.theme

    const [status, setStatus] = useState(false)
    // const [profilePicture, setProfilePicture] = useState("")

    // const api = 'http://localhost:3001'

    // useState(()=> {
    //     if(user.profilePicture) setProfilePicture(user.profilePicture)
    //     else setProfilePicture("")
    // },[])

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
        <Row style={{margin: "1em", borderRadius:"5px"}}>
            <Col lg={2} style={{display: "grid", placeItems: "center"}}>
                <Link to={username} className="userFollow" style={{padding: 0}}>
                    { profilePicture ? 
                    <img src={profilePicture} 
                    style={{width: "32px", height: "32px", cursor: "pointer", borderRadius: "50%"}}/>:
                    <img src="https://img.icons8.com/external-becris-lineal-becris/256/external-user-mintab-for-ios-becris-lineal-becris.png" 
                    style={{width: "32px", height: "32px", cursor: "pointer", borderRadius: "50%"}}/>}
                </Link>
            </Col>
            <Col lg={6} style={{display: "grid",}}>
                <h4 style={{margin: "0", display: "flex", alignItems: "center"}}>
                    <Link to={username} className="userFollow" style={{padding: 0, color: user.fontColor, fontWeight: "600", color: fontColor}}>
                        @{username}
                    </Link>
                </h4>
            </Col>
            <Col lg={4} style={{display: "grid", placeItems: "center", verticalAlign:"middle"}}>
                { status ? 
                <Button variant="light" onClick={unfollowUser} style={{borderRadius: "20px", padding: "5px 15px", fontWeight: "600"}} > Unfollow </Button> :
                <Button variant="light" onClick={followUser} style={{borderRadius: "20px", padding: "5px 15px", fontWeight: "600"}} > Follow </Button>
                }

                {/* <Button variant="light" onClick={followUser} style={{borderRadius: "20px", padding: "5px 15px"}} disabled={text !== "Follow"}> {text} </Button> */}
            </Col>
        </Row>
    </>)
}