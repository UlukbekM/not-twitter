import React, {useState, useEffect} from "react";
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Axios from 'axios';

export const Tweet = (tweet) => {
    const [liked, setLiked] = useState(false)

    // useEffect(()=> {
    //     if(twe)
    // },[])

    const api = 'http://localhost:3001'

    const clickButton = () => {
        // setLiked(!liked)
        Axios.put(`${api}/likeTweet/${tweet._id}`, { 
            username: tweet.username,
            token: window.sessionStorage.getItem("token")
        })
        // .then(()=> {
        //     getTasks()
        // })
    }

    // console.log(tweet.date.toString())

    return(<>
    <Container style={{backgroundColor: "#fffffe", margin: "1em 0", borderRadius: "5px", padding: 0}} lg={10}>
        <Row>
            <h5 style={{margin: "1em"}}>
                {tweet.content}
            </h5>
        </Row>
        <Row>
            <Col>
            <Button onClick={clickButton}>
                { liked ? <i className="bi bi-heart-fill"/>:<i className="bi bi-heart"/>}
            </Button>
                {tweet.likes.length}
            </Col>
            <Col>
                {tweet.date}
            </Col>
        </Row>
    </Container>
    </>)
}