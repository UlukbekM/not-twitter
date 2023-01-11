import React, {useState, useEffect} from 'react'
import Axios from 'axios';

export const LogInSignUp = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [toggle, setToggle] = useState(false)

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

    const logInSubmit = async e => {
        e.preventDefault();

        Axios.get(`${api}/login`, {
            params: {
                email: email,
                password: password
            }
        })
        // .then((response)=> {
        //     console.log(responm)
        // })
    }

    return(<>
        <div className='loginsignupContainer'>

            <div className='formContainer'>
                {toggle ? 
                    <form onSubmit={signUpSubmit}>
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
                        {/* {email !== "" && username !== "" && password !== "" ?  <button>Submit</button>: <button type="submit">Submit</button>} */}

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
    </>)
}