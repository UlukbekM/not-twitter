import React,{useEffect, useState} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";
import Axios from 'axios';

export const MiniUser = (user) => {
    const {backgroundColor, api, fontColor, titleColor, borderColor, tweetBackground, tweetTitleColor, tweetTextColor} = user.theme

    const [status, setStatus] = useState(false)

    const [profile, setProfile] = useState([])

    // console.log(user)

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
        // console.log(user.mainUser + " will follow " + user.username)
        Axios.put(`${api}/followUser`, {
            follower: user.mainUser,
            following: user.username,
            token: window.sessionStorage.getItem("token")
            // token: token
        }).then((response)=> {
            if(response.data === "user followed") {
                setStatus(!status)
            }
        })
    }

    const unfollowUser = () => {
        // let token = window.sessionStorage.getItem("token");
        // console.log(user.mainUser + " will unfollow " + user.username)
        Axios.put(`${api}/unfollowUser`, {
            unfollower: user.mainUser,
            target: user.username,
            token: window.sessionStorage.getItem("token")
        }).then((response)=> {
            if(response.data === "user unfollowed") {
                setStatus(!status)
            }
        })
    }

    useEffect(() => {
        getInfo()
    } ,[])

    const getInfo = () => {
        Axios.get(`${api}/getUserProfile`, {
            params: {
                username: user.username
            }
        }).then((response)=> {
            setProfile(response.data)
        })
    }

    return(<>
        <Row style={{background: tweetBackground, width: "95%", padding: "0.2em", borderRadius: "5px", alignItems: "center"}}>
            <Col xs={2} lg={1}>
                <Link to={"../../" + user.username} className="userFollow" style={{padding: 0}}>
                    {/* <img src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png" style={{width: "2rem", height: "2rem"}}/> */}
                    {profile.profile ? 
                        <img src={profile.profile} 
                        style={{width: "32px", height: "32px", cursor: "pointer", borderRadius: "50%"}}/> :
                        <img src="https://img.icons8.com/external-becris-lineal-becris/256/external-user-mintab-for-ios-becris-lineal-becris.png" 
                        style={{width: "32px", height: "32px", cursor: "pointer", borderRadius: "50%"}}/>
                    }
                    
                </Link>
            </Col>

            <Col xs={5} lg={9}>
                <Row style={{fontWeight: "bold", display: "inline"}}>
                    <Link to={"../../" + user.username} className="userFollow" style={{padding: 0}}>
                        {user.username}
                    </Link>
                </Row>
                <Row style={{color: tweetTextColor,overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>
                    {profile.description ? profile.description : "Description"}
                </Row>
            </Col>

            <Col xs={5} lg={2} style={{textAlign: "center",color: tweetTextColor}}>
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