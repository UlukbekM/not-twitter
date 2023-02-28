import React, {useState, useEffect} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";

export const Footer = (props) => {
    const [username, setUsername] = useState("")
    const [page, setPage] = useState("")
    const location = useLocation();

    const checkLocation = (name) => {
        if(window.location.pathname == "/"){
            setPage("home")
        }
        else if(window.location.pathname.includes(name)) {
            setPage("profile")
        } else {
            setPage("")
        }
    }

    useEffect(()=> {
        if(props.username) {
            setUsername(props.username)
        } else {
            setUsername("")
        }
    }, [props])

    useEffect(()=> {
        // console.log(location, props.username)
        checkLocation(username)
    }, [location])

    useEffect(()=> {
        checkLocation(username)
    },[])

    return(<div className="footerC">
    <Row style={{position: "fixed", height: "50px", bottom: 0, width: "100%", textAlign: "center", backgroundColor: "#b8c1ec", margin: 0, alignItems: "center"}}>
            <Col>
                <Link to={"/"}>
                    { page === "home" 
                    ? <i className="bi bi-house-door-fill" style={{fontSize: "1.5em", fontWeight: "bold"}}/> 
                    : <i className="bi bi-house-door" style={{fontSize: "1.5em", fontWeight: "bold"}}/> }
                </Link>
            </Col>
            {/* <Col>
                Search
            </Col> */}
            <Col>
                <Link to={`/${props.username}`}>
                    { page === "profile" 
                    ? <i className="bi bi-person-fill" style={{fontSize: "1.5em", fontWeight: "bold"}}/> 
                    : <i className="bi bi-person" style={{fontSize: "1.5em", fontWeight: "bold"}}/> }
                </Link>
            </Col>
        </Row>
    </div>)
}