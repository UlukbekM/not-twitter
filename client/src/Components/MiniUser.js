import React,{useEffect, useState} from "react";
import Row from 'react-bootstrap/Row';

export const MiniUser = (user) => {

    return(<>
        <Row style={{background: "#fffffe", width: "95%", padding: "0.2em", borderRadius: "5px"}}>
            {user.username}
        </Row>
    </>)
}