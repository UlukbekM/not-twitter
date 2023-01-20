import React, {useEffect, useState} from 'react'
import jwt_decode from "jwt-decode";

export const Home = () => {
    const [user, setUser] = useState("");

    useEffect(()=> {
        let token = window.sessionStorage.getItem("credential");
        if(token !== null) {
            var decoded = jwt_decode(token);
            setUser(decoded)
            // console.log(decoded);
        } else {
            window.location = "/landing"
        }
    },[])


    return(<>
    Hello
    </>)
}