import React, {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Axios from 'axios';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { LandingItem } from './LandingItem';

export const Landing = (props) => {
    const {backgroundColor, api, formBackgroundColor} = props.theme

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [toggle, setToggle] = useState(true)

    
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(()=> {
        let token = window.sessionStorage.getItem("token");
        if(token !== null) {
            window.location = "/"
        }
    },[])

    const registerSubmit = async e => {
        e.preventDefault();
        //PREVENT PEOPLE FROM PICKING 'PEOPLE' 'LANDING' AS USERNAME
        // console.log(username)
        if(username === "people" || username === "landing") {
            alert("Cannot use this username")
            return
        }

        if(email && username && password) {
            Axios.post(`${api}/register`, {
                email: email,
                username: username,
                password: password
            }).then((response)=> {
                // saveToken(response.data.token)
                // console.log(response)
                if(response.data.token) {
                    window.sessionStorage.setItem("token", response.data.token);
                    window.location = "/"
                } else {
                    console.log(response)
                }
            }).catch(function (error) {
                let message = error.response.data
                if(message === "Email Already Exists." || message === "Username Already Exists.") {
                    alert(message)
                }
            }) 
        } else {
            alert("All fields must be fulfulled")
        }
    }

    const logInSubmit = async e => {
        e.preventDefault();
        if(email && password) {
            Axios.get(`${api}/login`, {
                params: {
                    email: email,
                    password: password
                }
            }).then((response)=> {
                if(response.data == "incorrect email!") {
                    alert("Email not found")
                } else if(response.data == "incorrect password!") {
                    alert("Incorrect password")
                    setPassword("")
                } else {
                    window.sessionStorage.setItem("token", response.data);
                    window.location = "/"
                }
            })
        } else {
            alert("All fields must be fulfulled")
        }
    }

    const toggleFunction = () => {
        setEmail("")
        setUsername("")
        setPassword("")
        setToggle(!toggle)
    }

    let array = ["/logo192.png","https://seeklogo.com/images/N/nodejs-logo-FBE122E377-seeklogo.com.png", "https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/359/full/expressjslogo.png",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Bootstrap_logo.svg/800px-Bootstrap_logo.svg.png", "https://cdn.icon-icons.com/icons2/2415/PNG/512/mongodb_original_wordmark_logo_icon_146425.png",
                "https://user-images.githubusercontent.com/2277182/75613896-f24f5800-5b32-11ea-966e-4ed4b41f873a.png"]

    return(<>
        {/* <Container fluid className="landingContainer">
            <Row>
                <Col xs="0" lg="9" className="mobileCol" style={{background: backgroundColor}}>
                </Col>
                <Col xs="12" lg="3" style={{background: formBackgroundColor, height: "100vh" }} className="formCol">
                {toggle ? 
                    <div className='formContainer'>
                        <Form onSubmit={logInSubmit}>
                            <Form.Label><h1>Not Twitter</h1></Form.Label>

                            <Form.Group className="mb-3" controlId="formBasicH3">
                                <Form.Label><h4>Log In</h4></Form.Label>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={email} onChange={({ target }) => setEmail(target.value)}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password} onChange={({ target }) => setPassword(target.value)}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicToggle">
                                <Form.Text className="text-muted">
                                    Don't have an account? <b onClick={()=> toggleFunction()}>Sign up</b>
                                </Form.Text>
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>

                    :
                    <div className='formContainer'>
                        <Form onSubmit={registerSubmit}>
                            <Form.Label><h1>Not Twitter</h1></Form.Label>

                            <Form.Group className="mb-3" controlId="formBasicH3">
                                <Form.Label><h4>Create Account</h4></Form.Label>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={email} onChange={({ target }) => setEmail(target.value)}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="username" placeholder="Username" value={username} onChange={({ target }) => setUsername(target.value)}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password} onChange={({ target }) => setPassword(target.value)}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicToggle">
                                <Form.Text className="text-muted">
                                    Already have an account? <b onClick={()=> toggleFunction()}>Log in</b>
                                </Form.Text>
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                    }
                </Col>
            </Row>
        </Container> */}

        <div style={{backgroundColor: backgroundColor, display: "flex", alignItems: "center"}} className='landingPage'>
            {/* <div style={{ width: "100%", textAlign: "right"}}>
                <div onClick={handleShow} style={{cursor: "pointer", color: "#fff", padding: "1em", fontWeight: "bold"}}>Log In/Sign Up</div>
            </div>


            <div style={{display: "flex", marginLeft: "2em"}}>
                <h2 className='titleAnimation' style={{margin: 0}}> Not Twitter </h2>
                <img src="/not-twitter.png" width="150px" className='logoAnimation'/>
            </div>

            <div style={{margin: "2em", color: "#fffffe"}}>
                <h4 className='titleTextAnimation1' style={{marginTop: "1em"}}>
                    Project by Ulukbek Mambetov
                </h4>
                <h4 className='titleTextAnimation2' style={{marginTop: "1em"}}>
                    Built using React, Node.js, Express.js, Bootstrap, MongoDB, and AWS S3
                </h4>

                <h4 style={{marginTop: "1em"}}><a style={{textDecoration: "none", color: "inherit"}} target="_blank" rel="noopener noreferrer" href="https://github.com/UlukbekM/not-twitter">GitHub <i class="bi bi-box-arrow-up-right"/></a></h4>
            </div> */}

            <div style={{width: "100%"}}>
                <div style={{display: "flex", marginLeft: "2em"}}>
                    <h2 className='titleAnimation' style={{margin: 0}}> Not Twitter </h2>
                    <img src="/not-twitter.png" width="150px" className='titleAnimation'/>
                </div>

                <div style={{margin: "2em", color: "#fffffe"}}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <h4 className='titleTextAnimation1' style={{marginTop: "1em"}}>
                            A project by Ulukbek Mambetov
                        </h4>

                        <button className='tweetButtonSide logoAnimation' onClick={handleShow} style={{fontSize: "20px"}}>Log In / Sign Up</button>
                        {/* <div onClick={handleShow} style={{cursor: "pointer", color: "#fff", padding: "1em", fontWeight: "bold"}}>Log In/Sign Up</div> */}
                    </div>
                    <h4 className='titleTextAnimation2' style={{marginTop: "1em"}}>
                        Built using React, Node.js, Express.js, Bootstrap, MongoDB, and AWS S3
                    </h4>

                    <h4 style={{marginTop: "1em"}} className="titleTextAnimation3 gitHub"><a style={{textDecoration: "none", color: "inherit"}} target="_blank" rel="noopener noreferrer" href="https://github.com/UlukbekM/not-twitter">GitHub <i class="bi bi-box-arrow-up-right"/></a></h4>
                </div>
            </div>




            {/* <div style={{display: "flex", flexWrap: "wrap", marginLeft: "2em"}}>
                {array.map((item,value) => (
                    <LandingItem item={item} key={value}/>
                ))}
            </div> */}


            <Offcanvas show={show} onHide={handleClose} placement='end'  style={{backgroundColor: formBackgroundColor}}>
                {/* <div style={{background: formBackgroundColor, height: "100vh"}}> */}
                    {/* <button onClick={handleClose}>Close</button> */}
                    <Offcanvas.Header closeButton style={{display: "flex", justifyContent: "end"}}> </Offcanvas.Header>
                    {toggle ? 
                    <div className='formContainer' style={{height: "100%", width: "100%", display: "flex", alignItems: "center"}}>
                        <Form onSubmit={logInSubmit} style={{width: "100%", margin: "0 0.5em", marginTop: "-5em"}}>
                            <Form.Label><h1>Not Twitter</h1></Form.Label>

                            <Form.Group className="mb-3" controlId="formBasicH3">
                                <Form.Label><h4>Log In</h4></Form.Label>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={email} onChange={({ target }) => setEmail(target.value)}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password} onChange={({ target }) => setPassword(target.value)}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicToggle">
                                <Form.Text className="text-muted">
                                    Don't have an account? <b onClick={()=> toggleFunction()}>Sign up</b>
                                </Form.Text>
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                    :
                    <div className='formContainer' style={{height: "100%", width: "100%", display: "flex", alignItems: "center"}}>
                        <Form onSubmit={registerSubmit} style={{width: "100%", margin: "0 0.5em", marginTop: "-5em"}}>
                            <Form.Label><h1>Not Twitter</h1></Form.Label>

                            <Form.Group className="mb-3" controlId="formBasicH3">
                                <Form.Label><h4>Create Account</h4></Form.Label>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={email} onChange={({ target }) => setEmail(target.value)}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="username" placeholder="Username" value={username} onChange={({ target }) => setUsername(target.value)}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password} onChange={({ target }) => setPassword(target.value)}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicToggle">
                                <Form.Text className="text-muted">
                                    Already have an account? <b onClick={()=> toggleFunction()}>Log in</b>
                                </Form.Text>
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                    }
                {/* </div> */}
            </Offcanvas>
        </div>
    </>)
}