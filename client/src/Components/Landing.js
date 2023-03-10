import React, {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Axios from 'axios';

export const Landing = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [toggle, setToggle] = useState(true)

    const api = 'http://localhost:3001'

    useEffect(()=> {
        let token = window.sessionStorage.getItem("token");
        if(token !== null) {
            window.location = "/"
        }
    },[])

    const registerSubmit = async e => {
        e.preventDefault();
        if(email && username && password) {
            Axios.post(`${api}/register`, {
                email: email,
                username: username,
                password: password
            }).then((response)=> {
                // saveToken(response.data.token)
                // console.log(response)
                window.sessionStorage.setItem("token", response.data.token);
                window.location = "/"
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

    return(<>
        <Container fluid style={{background: "#232946"}} className="landingContainer">
            <Row>
                <Col xs="1" lg="9" className="mobileCol">
                </Col>
                <Col xs="12" lg="3" style={{background: "#eebbc3", height: "100vh" }} className="formCol">
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
        </Container>
    </>)
}