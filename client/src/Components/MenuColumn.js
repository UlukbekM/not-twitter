import React, {useState, useEffect} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Stack from 'react-bootstrap/Stack'
import { useLocation } from 'react-router-dom';

const colorBg = "#232946"

export const MenuColumn = () => {
    const [username, setUsername] = useState("")
    const [page, setPage] = useState("")
    const location = useLocation();

    const checkLocation = (name) => {

        if(window.location.pathname === "/"){
            setPage("home")
            return
        }

        let index = window.location.pathname.substring(1).indexOf("/")
        if(index === -1 && window.location.pathname.substring(1) === name) {
            setPage("profile")
        } else if (index > 0 && window.location.pathname.substring(1,index+1) === name) {
            setPage("profile")
        } else {
            setPage("")
        }
    }

    useEffect(() => {
        checkLocation(username)
    }, [location]);

    useEffect(()=> {
        let token = window.sessionStorage.getItem("token");
        if(token === null) {
            window.location = "/landing"
        }

        let decoded = jwt_decode(token);
        setUsername(decoded.username)
        checkLocation(decoded.username)
    },[])

    return (<>
        <Col style={{background: colorBg, minHeight: "100vh", position: "fixed", left: 0}} className="mobileCol" lg={3}>
            <Row>
                <Col lg={3}>
                </Col>
                <Col lg={6} style={{color: "#fff", fontWeight: "bold", fontSize: "1.5em"}}>
                    <Row style={{marginTop: "1em"}}>
                        <h1>Not Twitter</h1>
                    </Row>

                    <Stack gap={4} style={{marginTop: "2em"}}>
                        <Row style={{display: "inline"}}>
                                <Link to={"/"} className="menuItem">
                                        { page === "home" 
                                        ? <i className="bi bi-house-door-fill" style={{paddingRight: "0.5em"}}/> 
                                        : <i className="bi bi-house-door" style={{paddingRight: "0.5em"}}/> }
                                        Home
                                </Link>
                        </Row>

                        <Row style={{display: "inline"}}>
                            <Link to={`/${username}`} className="menuItem">
                                    { page === "profile" ? <i className="bi bi-person-fill" style={{paddingRight: "0.5em"}}/> : <i className="bi bi-person" style={{paddingRight: "0.5em"}}/> }
                                    Profile
                            </Link>
                        </Row>
                    </Stack>
                </Col>
                <Col lg={3}>
                </Col>
            </Row>
        </Col>
    </>)
}