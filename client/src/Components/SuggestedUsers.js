import React, {useState} from "react";
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image'
import Axios from 'axios';

export const SuggestedUsers = (user) => {
    const { currentUser, email, username } = user
    const [text, setText] = useState("Follow")

    const api = 'http://localhost:3001'

    const followUser = () => {
        if(text !== "Following") {
            console.log(currentUser + " is going to follow " + email)
            Axios.put(`${api}/followUser`, {
                follower: currentUser,
                following: username
            }).then((response)=> {
                // saveToken(response.data.token)
                console.log(response)
                if(response.data === "user followed") {
                    setText("Following")
                }
            })
        }
    }

    return (<>
        <Row style={{
            // backgroundColor: "#61657a", 
            margin: "1em", borderRadius:"5px", display:"table"}}>
            <Col lg={1} style={{display: "table-cell"}}>
                <i className="bi bi-person-circle" style={{fontSize: "2rem"}}></i>
            </Col>
            <Col lg={5} style={{display: "table-cell", verticalAlign: "middle"}}>
                <h4 style={{margin: "0"}}>
                    @{username}
                </h4>
            </Col>
            <Col lg={2} style={{display: "table-cell", verticalAlign:"middle"}}>
                <Button variant="light" onClick={followUser} style={{borderRadius: "20px", padding: "5px 15px"}} disabled={text !== "Follow"}> {text} </Button>
            </Col>
        </Row>
    </>)
}