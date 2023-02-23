import React, {useState, useEffect} from "react";
import { useLocation } from 'react-router-dom';
import { useParams } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Axios from 'axios';
import { MenuColumn } from "./MenuColumn";
import Stack from 'react-bootstrap/Stack'
import { Link } from "react-router-dom";

const color = "#000"
const colorBg = "#232946"
const colorMain = "#eebbc3"
const colorSide = "#b8c1ec" 

export const FollowersPage = () => {
    const {username} = useParams()
    const location = useLocation();
    const [user, setUser] = useState([])
    
    const api = 'http://localhost:3001'
    // console.log(useParams())

    const getUser = (name) => {
        Axios.get(`${api}/getUser`, {
            params: {
                username: name
            }
        })
        .then((response)=> {
            console.log(response.data)
            setUser(response.data)
        })
    }

    useEffect(()=> {
        getUser(username)
    },[])

    return(<>
        <Container fluid style={{color: color}}>
            <Row>
                <MenuColumn/>
                
                <Col style={{background: colorMain, minHeight: "100vh" }} lg={6}>
                    { !user ? 
                    "user doesnt exist"
                    :
                    <>
                    <Stack gap={4} style={{padding: "0.5em 1em"}}>
                        {user.username? <h4 style={{margin: 0}}>{user.username}</h4>:<></>}
                        <Row style={{fontWeight: "bold", textAlign: "center"}}>
                            <Col>
                                <Link to="./../following" style={{textDecoration: "none", color: "inherit"}}>
                                    Following
                                </Link>
                            </Col>
                            <Col>
                                <p style={{borderBottom: "3px solid black", color: "#fff", paddingBottom: "0.5em"}}>
                                    Followers
                                </p>
                            </Col>
                        </Row>
                    </Stack>
                    </>
                    }
                </Col>
    
                <Col style={{background: colorBg}} className="mobileCol" lg={3}>
                    
                </Col>
            </Row>
        </Container>
    </>)
}