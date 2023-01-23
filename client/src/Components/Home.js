import React, {useEffect, useState} from 'react'
import jwt_decode from "jwt-decode";
import Button from 'react-bootstrap/Button';

export const Home = () => {
    const [user, setUser] = useState("");

    useEffect(()=> {
        let token = window.sessionStorage.getItem("token");
        if(token === null) {
            window.location = "/landing"
        } else {
            var decoded = jwt_decode(token);
            console.log(decoded);
        }
    },[])

    const logout = () => {
        sessionStorage.removeItem('token');
        window.location.reload();
    }

    return(<>
            <Button variant="primary" onClick={logout}>Log Out</Button>
    </>)
}