import React,{useEffect, useState} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";

export const MiniUser = (user) => {
    const [status, setStatus] = useState(false)
    // console.log(user.status)

    useEffect(() => {
        if(user.array) {
            console.log(user)
            if(user.array.some(e => e.username === user.username)) {
                setStatus(true)
            }
        }
    } ,[user.array])

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
                {status ? 
                    <button className="miniUserButton"> <span> Following </span> </button>
                    :
                    <button> TEMP </button>
                }
            </Col>
        </Row>
    </>)
}