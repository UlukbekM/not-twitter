import React, {useState, useEffect} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

export const Comment = (props) => {
    const {contentBackgroundColor, backgroundColor, api, fontColor, titleColor, borderColor, tweetBackground, tweetTitleColor, tweetTextColor, tweetButtonBackgroundColor, tweetButtonColor} = props.theme
    
    const [imageURL, setImageURL] = useState("")
    const [userImage, setUserImage] = useState("https://img.icons8.com/external-becris-lineal-becris/256/external-user-mintab-for-ios-becris-lineal-becris.png")

    useEffect(()=> {
        if(props.imageURL) {
            setImageURL(props.imageURL)
        }
    },[])

    useEffect(()=> {
        if(props.userImages[props.postedBy]) {
            setUserImage(props.userImages[props.postedBy])
        }
    },[props.userImages])

    return(
        <div style={{borderBottom: "1px solid black", paddingBottom: "0.5em", paddingTop: "0.5em"}}>
            <Row>
                <Col xs={2} lg={1} style={{display: "grid", placeItems: "center"}}>
                    <img src={userImage} style={{width: "40px", height: "40px", cursor: "pointer", borderRadius: "50%"}}/>
                </Col>
                <Col xs={10} lg={11} style={{fontWeight: "bold", fontSize: "20px", display:"flex", alignItems: "center"}}>
                    {/* <Row style={{fontWeight: "bold", fontSize: "20px", }}> */}
                        <p style={{margin: 0}}>@{props.postedBy}</p>
                    {/* </Row> */}
                </Col>
            </Row>
            <Row>
                <Col xs={0} lg={1}>
                </Col>
                <Col xs={12} lg={11}>
                    {/* <Row style={{fontWeight: "500"}}> */}
                        {props.content}
                    {/* </Row> */}
                    {imageURL && 
                        <Row style={{justifyContent:"center"}}>
                            <img src={imageURL} style={{padding: "1em 0", borderRadius: "40px", maxHeight: "400px", width: "auto"}} draggable="true"/>
                        </Row>}
                </Col>
            </Row>
        </div>)
}