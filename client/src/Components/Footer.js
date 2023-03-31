import React, {useState, useEffect} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";

export const Footer = (props) => {
    const [username, setUsername] = useState("")
    const [page, setPage] = useState("")
    const location = useLocation();

    const checkLocation = () => {
        // console.log(username, window.location.pathname)
        if(window.location.pathname === "/"){
            setPage("home")
            return
        }

        let index = window.location.pathname.substring(1).indexOf("/")
        if(index === -1 && window.location.pathname.substring(1) === username) {
            setPage("profile")
        } else if (index > 0 && window.location.pathname.substring(1,index+1) === username) {
            setPage("profile")
        } else {
            setPage("")
        }
    }

    useEffect(()=> {
        if(props.username) {
            setUsername(props.username)
            // checkLocation(props.username)
        } else {
            setUsername("")
        }
    }, [props])

    useEffect(()=> {
        // console.log(location, props.username)
        checkLocation()
    }, [location])

    useEffect(()=> {
        let token = window.sessionStorage.getItem("token");
        let decoded = jwt_decode(token)
        setUsername(decoded.username)
    },[])

    const scrollUp = () => {
        window.scrollTo(0, 0);
    }

    return(<div className="footerC">
    <Row style={{position: "fixed", height: "50px", bottom: 0, width: "100%", textAlign: "center", backgroundColor: "#b8c1ec", margin: 0, alignItems: "center"}}>
            <Col>
                {page === "home" ? 
                <div onClick={scrollUp}>
                    { page === "home" 
                    ? <i className="bi bi-house-door-fill" style={{fontSize: "1.5em", fontWeight: "bold"}}/> 
                    : <i className="bi bi-house-door" style={{fontSize: "1.5em", fontWeight: "bold"}}/> }
                </div>
                :
                <Link to={"/"} style={{textDecoration: "inherit", color: "inherit"}}>
                    { page === "home" 
                    ? <i className="bi bi-house-door-fill" style={{fontSize: "1.5em", fontWeight: "bold"}}/> 
                    : <i className="bi bi-house-door" style={{fontSize: "1.5em", fontWeight: "bold"}}/> }
                </Link>
                }
            </Col>
            {/* <Col>
                Search
            </Col> */}
            <Col>
                {page === "profile" ? 
                <div onClick={scrollUp}>
                    { page === "profile" 
                    ? <i className="bi bi-person-fill" style={{fontSize: "1.5em", fontWeight: "bold"}}/> 
                    : <i className="bi bi-person" style={{fontSize: "1.5em", fontWeight: "bold"}}/> }
                </div>:
                <Link to={`/${props.username}`} style={{textDecoration: "inherit", color: "inherit"}}>
                    { page === "profile" 
                    ? <i className="bi bi-person-fill" style={{fontSize: "1.5em", fontWeight: "bold"}}/> 
                    : <i className="bi bi-person" style={{fontSize: "1.5em", fontWeight: "bold"}}/> }
                </Link>
                }
            </Col>
        </Row>
    </div>)
}