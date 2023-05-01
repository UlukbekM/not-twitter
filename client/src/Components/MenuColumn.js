import React, {useState, useEffect} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Stack from 'react-bootstrap/Stack'
import { useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { TweetForm } from './TweetForm';
import Dropdown from 'react-bootstrap/Dropdown';


export const MenuColumn = (props) => {
    const { backgroundColor, titleColor, buttonFontColor, tweetBackground} = props.theme

    // console.log(props)

    const [username, setUsername] = useState("")
    const [page, setPage] = useState("")
    const [profilePicture, setProfilePicture] = useState("https://img.icons8.com/external-becris-lineal-becris/256/external-user-mintab-for-ios-becris-lineal-becris.png")
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
        let token = window.sessionStorage.getItem("token");
        let decoded = jwt_decode(token);
        // console.log(decoded.profile)
        checkLocation(decoded.username)
    }, [location]);

    useEffect(()=> {
        let token = window.sessionStorage.getItem("token");
        if(token === null) {
            window.location = "/landing"
        }

        let decoded = jwt_decode(token);
        // getProfile()
        if(decoded.profile) setProfilePicture(decoded.profile)
        setUsername(decoded.username)
        checkLocation(decoded.username)
    },[])


    useEffect(() => {
        // console.log(props.profilePicture)
        getProfile()
        // if(props.profilePicture) {
        //     setProfilePicture(props.profilePicture)
        // }
    }, [props.profilePicture]);
    

    const logout = () => {
        sessionStorage.removeItem('token');
        // window.location.reload();
            window.location = "/landing"
    }

    const getProfile = () => {
        let token = window.sessionStorage.getItem("token");
        let decoded = jwt_decode(token);
        if(decoded.profile) setProfilePicture(decoded.profile)
    }

    return (<>
        <Col style={{background: backgroundColor, minHeight: "100vh", position: "fixed", left: 0, userSelect: "none"}} className="mobileCol" lg={3} xs={0} sm={true} md={true}>
            <Row style={{height: "100vh"}}>
                <Col lg={3}>
                </Col>

                <Col lg={6} style={{color: "#fff", fontWeight: "bold", fontSize: "1.5em",display: "flex", flexDirection: "column"}}>
                    <div style={{flex: 1}}>
                        <Row style={{marginTop: "1em"}}>
                            <Link to={"/"} style={{textDecoration: "inherit", color: "#fff"}}>
                                <h1>Not Twitter</h1>
                            </Link>
                        </Row>

                        <Stack gap={4} style={{marginTop: "2em", fontSize: "1.1em"}}>
                            <Row style={{display: "inline", color: titleColor}}>
                                    <Link to={"/"} className="menuItem menuItemHover">
                                            { page === "home" 
                                            ? <i className="bi bi-house-door-fill" style={{paddingRight: "0.5em"}}/> 
                                            : <i className="bi bi-house-door" style={{paddingRight: "0.5em"}}/> }
                                            Home
                                    </Link>
                            </Row>

                            <Row style={{display: "inline", color: titleColor}}>
                                <Link to={`/${username}`} className="menuItem menuItemHover">
                                        { page === "profile" ? <i className="bi bi-person-fill" style={{paddingRight: "0.5em"}}/> : <i className="bi bi-person" style={{paddingRight: "0.5em"}}/> }
                                        Profile
                                </Link>
                            </Row>
                        </Stack>

                        <Row style={{marginTop: "2em"}}>
                            <button className="tweetButtonSide" style={{color: buttonFontColor}} onClick={props.handleShow}>Tweet</button>
                        </Row>
                    </div>

                        <div style={{marginBottom: "0.5em"}} className="menuItemHover">
                            {/* <Row style={{}} className="menuItemHover">
                                <Container style={{
                                    display: "flex", 
                                    // justifyContent: "center", 
                                    alignItems: "center",
                                    textAlign: "center",
                                    padding: "0.25em 0.5em", 
                                    // background: "rgba(255, 255, 255, 0.1)", 
                                    borderRadius: "40px",
                                    // position: "absolute",
                                    // bottom: 0
                                    }}>
                                    <Col lg={3}>
                                        <img src={profilePicture} style={{width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "red"}}/>
                                    </Col>

                                    <Col lg={6} style={{textAlign: "left"}}>
                                        <p style={{margin: 0, fontSize: "22px", fontWeight: "500"}}>@{username}</p>
                                    </Col>

                                    <Col lg={3}>
                                    <Dropdown drop="up-centered">
                                        <Dropdown.Toggle style={{backgroundColor: "inherit", color: "#fff", border: "none",}}>
                                            <i className="bi bi-three-dots" style={{cursor: "pointer"}}></i>
                                        </Dropdown.Toggle>
                        
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={logout}>Log out @{username}</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    </Col>
                                </Container>
                            </Row> */}

                            
                        <Dropdown drop="up-centered" >
                            <Dropdown.Toggle style={{border: "none" ,backgroundColor: "inherit", display: "flex", width: "100%", padding: "0.5em 0.5em", justifyContent: "center", alignItems: "center", borderRadius: "40px"}}>
                                <Col lg={3}>
                                    <img src={profilePicture} alt="profile-picture"style={{width: "40px", height: "40px", borderRadius: "50%"}}/>
                                </Col>

                                <Col lg={6} style={{textAlign: "left"}}>
                                    <p style={{margin: 0, fontSize: "22px", fontWeight: "500"}}>@{username}</p>
                                </Col>
                                

                                <Col lg={3}>
                                    {/* <i className="bi bi-three-dots" style={{cursor: "pointer"}}></i> */}
                                </Col>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={logout}>Log out @{username}</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown.Toggle>
                        </Dropdown>

                        </div>
                </Col>
                <Col lg={3}>
                </Col>
            </Row>


        </Col>
    </>)
}