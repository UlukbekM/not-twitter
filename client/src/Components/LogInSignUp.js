import React, {useState, useEffect} from 'react'
import Axios from 'axios';
import jwt_decode from "jwt-decode";

export const LogInSignUp = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [toggle, setToggle] = useState(false)

    useEffect(()=> {
        let token = window.sessionStorage.getItem("token");
        if(token !== null) {
            // var decoded = jwt_decode(token);
            // setCredentials(decoded)
            // console.log(decoded);
            window.location = "/landing"
        }
    },[])


    const toggleFunction = () => {
        setEmail("")
        setUsername("")
        setPassword("")
        setToggle(!toggle)
    }

    const api = 'http://localhost:3001'

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(email,username,password)
    };

    const signUpSubmit  = async e => {
        e.preventDefault();
        var emailCheck = await Axios.get(`${api}/checkEmail/${email}`).then((response) => {
            if(response.data.length > 0) {
                alert("Email is already in use!")
                return true
            } else {
                return false
            }
        })
        var usernameCheck = await Axios.get(`${api}/checkUsername/${username}`).then((response)=> {
            if(response.data.length > 0) {
                alert("Username is already in use!")
                return true
            } else {
                return false
            }
        })

        if(emailCheck === false && usernameCheck === false) {
            Axios.post(`${api}/newUser`, {
                email: email,
                username: username,
                password: password
            }).then(()=> {
                console.log('posted')
            })
            console.log("run")
        }
    }

    // const saveToken = (token) => {
    //     console.log(token)
    // }

    const registerSubmit = async e => {
        e.preventDefault();
        if(email && username && password) {
            Axios.post(`${api}/register`, {
                email: email,
                username: username,
                password: password
            }).then((response)=> {
                // saveToken(response.data.token)
                window.sessionStorage.setItem("token", response.data.token);
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
                } else {
                    window.sessionStorage.setItem("token", response.data);
                }
            })
        } else {
            alert("All fields must be fulfulled")
        }
    }

    return(<>
    
    <div className='container'>
        <img src='https://dthezntil550i.cloudfront.net/u1/latest/u12108230856157280000169619/1280_960/4ab19acf-13cd-402c-a966-38f815c3c43f.png'/>
        <div className='loginsignupContainer'>

            <div className='formContainer'>
                {toggle ? 
                    <form onSubmit={registerSubmit}>
                        <h1>Not Twitter</h1>
                        <h2>Create an account</h2>

                        <h4>Email Address</h4>
                        <input type="email" value={email} onChange={({ target }) => setEmail(target.value)}></input>
                        <h4>Username</h4>
                        <input value={username} onChange={({ target }) => setUsername(target.value)}></input>
                        <h4>Password</h4>
                        <input type="password" value={password} onChange={({ target }) => setPassword(target.value)}/>
                        <br/>
                        <button type="submit">Submit</button>

                        <h5>Already have an account? <b onClick={()=> toggleFunction()}>Log in</b></h5>
                    </form>
                    :
                    <form onSubmit={logInSubmit}>
                        <h1>Not Twitter</h1>
                        <h2>Log In</h2>

                        <h4>Email Address</h4>
                        <input type="email" value={email} onChange={({ target }) => setEmail(target.value)}></input>
                        <h4>Password</h4>
                        <input type="password" value={password} onChange={({ target }) => setPassword(target.value)}/>
                        <br/>
                        <button type="submit">Submit</button>

                        <h5>Don't have an account? <b onClick={()=> toggleFunction()}>Sign up</b></h5>
                    </form>
                }
            </div>
        </div>
    </div>
    </>)
}