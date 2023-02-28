import React,{useEffect, useState} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";

export const MiniUser = (user) => {
    // const [follower, setFollower] = useState("false")
    console.log(user)

    // useEffect(() => {
    //     if(user.status == "follower") {
    //         setFollower("true")
    //     } else {
    //         setFollower("false")
    //     }
    // } ,[])

    return(<>
        <Row style={{background: "#fffffe", width: "95%", padding: "0.2em", borderRadius: "5px", alignItems: "center"}}>
            <Col xs={2} lg={1}>
                <Link to={"../../" + user.username} className="userFollow" style={{padding: 0}}>
                    <img src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png" style={{width: "2rem", height: "2rem"}}/>
                </Link>
            </Col>

            <Col xs={6} lg={9}>
                <Row style={{fontWeight: "bold"}}>
                    <Link to={"../../" + user.username} className="userFollow" style={{padding: 0}}>
                        {user.username}
                    </Link>
                </Row>
                <Row>
                    Description...
                </Row>
            </Col>

            <Col xs={4} lg={2}>
                {user.status == "following" ?
                    <button className="miniUserButton"> <span> Following </span> </button>
                    :
                    <button> Follow </button>}
            </Col>
        </Row>
    </>)
}