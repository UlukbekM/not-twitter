import React, {useState, useEffect} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import AWS from 'aws-sdk';
import jwt_decode from "jwt-decode";


AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESSKEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESSKEY,
    region: 'us-east-1',
    signatureVersion: 'v4',
});


export const TweetForm = (props) => {
    const {backgroundColor, api, fontColor, tweetButtonColor, buttonFontColor} = props.theme

    // console.log(props)
    // console.log(props)

    const [tweet, setTweet] = useState("")
    const [image, setImage] = useState(null)

    const s3 = new AWS.S3();
    
    useEffect(()=> {
        if(props.mode === "comment") {
            if(image) {
                document.getElementById("tweetImageContainerComment").style.display = "flex"
            } else {
                document.getElementById("tweetImageContainerComment").style.display = "none"
            }
        }
        else if(props.mode === "normal") {
            if(image) {
                document.getElementById("tweetImageContainer").style.display = "flex"
            } else {
                document.getElementById("tweetImageContainer").style.display = "none"
            }
        } else {
            if(image) {
                document.getElementById("modalImageContainer").style.display = "flex"
            } else {
                document.getElementById("modalImageContainer").style.display = "none"
            }
        }
    },[image])

    const removeImage = () => {
        setImage(null)
    }

    const handleImage = e => {
        if(e.target.files[0].size > 2097152) {
            alert("File is too big!")
            setImage(null)
        } else {
            setImage(e.target.files[0])
            // console.log(props.mode)
            if(props.mode === "normal") {
                document.getElementById("tweetImageContainer").style.backgroundImage=`url(${window.URL.createObjectURL(e.target.files[0])})`
                document.getElementById("tweetImage").src=window.URL.createObjectURL(e.target.files[0])
            } 
            else if(props.mode === "comment") {
                document.getElementById("tweetImageContainerComment").style.backgroundImage=`url(${window.URL.createObjectURL(e.target.files[0])})`
                document.getElementById("tweetImageComment").src=window.URL.createObjectURL(e.target.files[0])
            }
            else {
                document.getElementById("modalImageContainer").style.backgroundImage=`url(${window.URL.createObjectURL(e.target.files[0])})`
                document.getElementById("modalImage").src=window.URL.createObjectURL(e.target.files[0])
            }
        }
    }

    const sendTweet = async e => {
        e.preventDefault()

        let imageURL = {Key: "", Location: ""}
        if(image) {
            imageURL = await uploadToS3()
        }
        
        let token = window.sessionStorage.getItem("token");
        let decoded = jwt_decode(token);

        if(props.mode === "comment") {
            // console.log('tweet reply!')
            Axios.post(`${api}/newComment`, {
                tweeter: props.tweeter,
                commenter: props.user,
                tweetId: props.tweetId,
                comment: tweet,
                imageURL: imageURL.Location,
                imageKey: imageURL.Key,
                token: token
            }).then((response)=> {
                console.log(response)
                if(response.data === 'comment posted') {
                    props.getComments()
                }
                // if(response && props.getFeed) {
                //     props.getFeed()
                // }
            })
        } else {
            Axios.post(`${api}/newTweet`, {
                username: decoded.username,
                tweet: tweet,
                imageURL: imageURL.Location,
                imageKey: imageURL.Key,
                token: token
            }).then((response)=> {
                console.log(response)
                if(response && props.getFeed) {
                    props.getFeed()
                } else if(response && props.getTweets) {
                    props.getTweets()
                }
            })
        }


        setTweet("")
        setImage(null)
        if(props.handleClose) props.handleClose()
    }

    // const sendComment = async e => {
    //     console.log('yes')
    // }

    const uploadToS3 = async () => {
        if (!image) {
            console.log('no image')
            return;
        }
        
        const params = { 
            Bucket: process.env.REACT_APP_BUCKET_NAME + '/tweet', 
            Key: `${Date.now()}.${image.name}`, 
            Body: image 
        };
        const { Location , Key} = await s3.upload(params).promise();
        
        let item = {Location, Key}
        return item
    }

    return (<>
        {props.mode === "comment" ? 
        // <Container style={{paddingTop: "1em",paddingBottom: "1em",}}>
        <div>
            <Row style={{height:"auto"}}>
                {/* <Col lg={1}>
                </Col>

                <Col lg={10}> */}
                    <textarea placeholder="Tweet your reply" className='tweetForm'
                        maxLength={280}
                        value={tweet}
                        onChange={({ target }) => setTweet(target.value)}
                        style={{        
                            resize: "none",
                            height: "auto",                    
                            backgroundColor: backgroundColor, 
                            border: "none", 
                            color: fontColor, 
                            outline: "none", 
                            fontFamily: "inherit",
                            // padding: "1em 0",
                            paddingTop: "1em",
                            paddingBottom: "1em",
                            // paddingLeft: "0",
                            // overflow: "hidden",
                            width: "100%",
                            // overflowY: "scroll",
                        }}
                    ></textarea>
                    
                    <div 
                        style={{backgroundSize: "cover", display: "flex", flexDirection: "column", borderRadius: "20px", marginTop: "1em"}}
                    // style={{ display: "flex", flexDirection: "column" ,width: "100%", height: "100%", backgroundSize: "cover", borderRadius: "20px", backgroundSize: "cover"}} 
                        id="tweetImageContainerComment">
                        <button className='tweetImageClose' onClick={removeImage}>
                            <p style={{margin: 0}}>X</p>
                        </button>
                        <img src="#" id="tweetImageComment" style={{paddingTop: "1em", borderRadius: "30px", maxWidth: "100%", opacity: 0,}}/>
                    </div>
                {/* </Col>

                <Col lg={1}>
                </Col> */}
            </Row>


            <Row style={{paddingTop: "1em"}}>
                <Col xs={1} lg={1} style={{display: "grid", placeItems: "center"}} className="iconEffect ">

                    <label htmlFor="image-uploadComment" className="pictureUploadButton">
                        <i className="bi bi-card-image imageUploadIcon " style={{fontSize: "1.3em", cursor: "pointer"}}/>
                    </label>
                    <input type="file" accept='image/*' onChange={handleImage} id="image-uploadComment" style={{display: "none"}}/>

                </Col>
                <Col xs={8}lg={9}>
                </Col>
                <Col xs={2} lg={2} style={{display: "grid", placeItems: "center"}}>
                    {/* <Button variant="secondary" onClick={sendTweet} disabled={!(tweet !== "")} 
                    style={{backgroundColor: tweetButtonColor, color: buttonFontColor, fontWeight: "600"}}>Tweet</Button> */}
                    <button className="tweetButton" onClick={sendTweet} disabled={!(tweet !== "")}>Reply</button>
                </Col>
                
            </Row>
            
            </div>
        // </Container>
        
        :
        props.mode === "normal" ? 
        <Container style={{paddingBottom: "0.5em"}}>
            <Row style={{height:"auto"}}>
                {/* <Col lg={1}>
                </Col>

                <Col lg={10}> */}
                    <textarea placeholder="What's Happening?" className='tweetForm'
                        maxLength={280}
                        value={tweet}
                        onChange={({ target }) => setTweet(target.value)}
                        style={{        
                            resize: "none",
                            height: "auto",                    
                            backgroundColor: backgroundColor, 
                            border: "none", 
                            color: fontColor, 
                            outline: "none", 
                            fontFamily: "inherit",
                            // paddingTop: "1em",
                            // paddingBottom: "1em",
                            padding: "1em 0",
                            // overflow: "hidden",
                            width: "100%",
                            overflowY: "scroll",}}
                    ></textarea>
                    
                    <div 
                        style={{backgroundSize: "cover", display: "flex", flexDirection: "column", borderRadius: "20px", marginTop: "1em"}}
                    // style={{ display: "flex", flexDirection: "column" ,width: "100%", height: "100%", backgroundSize: "cover", borderRadius: "20px", backgroundSize: "cover"}} 
                        id="tweetImageContainer">
                        <button className='tweetImageClose' onClick={removeImage}>
                            <p style={{margin: 0}}>X</p>
                        </button>
                        <img src="#" id="tweetImage" style={{paddingTop: "1em", borderRadius: "30px", maxWidth: "100%", opacity: 0,}}/>
                    </div>
                {/* </Col>

                <Col lg={1}>
                </Col> */}
            </Row>


            <Row style={{paddingTop: "1em"}}>
                <Col xs={1} lg={1} style={{display: "grid", placeItems: "center"}} className="iconEffect ">

                    <label htmlFor="image-upload" className="pictureUploadButton">
                        <i className="bi bi-card-image imageUploadIcon " style={{fontSize: "1.3em", cursor: "pointer"}}/>
                    </label>
                    <input type="file" accept='image/*' onChange={handleImage} id="image-upload" style={{display: "none"}}/>

                </Col>
                <Col xs={8}lg={9}>
                </Col>
                <Col xs={2} lg={2} style={{display: "grid", placeItems: "center"}}>
                    {/* <Button variant="secondary" onClick={sendTweet} disabled={!(tweet !== "")} 
                    style={{backgroundColor: tweetButtonColor, color: buttonFontColor, fontWeight: "600"}}>Tweet</Button> */}
                    <button className="tweetButton" onClick={sendTweet} disabled={!(tweet !== "")}>Tweet</button>
                </Col>
                
            </Row>
        </Container>
        :
        <Container>
            <Row>
                <textarea placeholder="What's Happening?" className='tweetForm'
                    maxLength={280}
                    value={tweet}
                    onChange={({ target }) => setTweet(target.value)}
                    style={{        
                        resize: "none",
                        height: "auto",                    
                        // backgroundColor: backgroundColor, 
                        border: "none", 
                        // border: "solid 1px black",
                        // color: fontColor, 
                        outline: "none", 
                        fontFamily: "inherit",
                        paddingTop: "1em",
                        paddingBottom: "1em",
                        overflow: "hidden"}}
                ></textarea>

                <div id="modalImageContainer"
                    style={{backgroundSize: "cover", display: "flex", flexDirection: "column", borderRadius: "20px"}}>
                    <button className='tweetImageClose' onClick={removeImage}>
                        <p style={{margin: 0}}>X</p>
                    </button>
                    <img src="#" id="modalImage" style={{paddingTop: "1em", borderRadius: "30px", maxWidth: "100%", opacity: 0}}/>
                </div>
            </Row>

            <Row style={{paddingTop: "1em"}}>
                <Col xs={1} lg={2} style={{display: "grid", placeItems: "center"}} className="iconEffect">
                    <label htmlFor="image-upload-modal" className="pictureUploadButton">
                        <i className="bi bi-card-image imageUploadIcon " style={{fontSize: "1.3em", cursor: "pointer"}}/>
                    </label>
                    <input type="file" accept='image/*' onChange={handleImage} id="image-upload-modal" style={{display: "none"}}/>
                </Col>

                <Col xs={8} lg={7}>
                </Col>

                <Col xs={2} lg={3} style={{alignItems: "center"}}>
                    {/* <Button variant="primary" onClick={sendTweet} disabled={!(tweet !== "")}>Tweet</Button> */}
                    <button className="tweetButton" onClick={sendTweet} disabled={!(tweet !== "")}>Tweet</button>
                </Col>
            </Row>
        </Container>
        
        }


    {/* {
        } */}
    </>)
}