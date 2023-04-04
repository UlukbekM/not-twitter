import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Axios from 'axios';
import Stack from 'react-bootstrap/Stack'
import { MenuColumn } from "./MenuColumn";
import { useLocation } from 'react-router-dom';
import { Tweet } from './Tweet';
import { Link } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import { Footer } from "./Footer";
import jwt_decode from "jwt-decode";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import AWS from 'aws-sdk';


export const UserPage = (props) => {
    const {backgroundColor, api, fontColor, titleColor, borderColor, tweetBackground, tweetTitleColor, tweetTextColor} = props.theme

    const s3 = new AWS.S3();
    // console.log(props)

    const [show, setShow] = useState(false);

    const [profilePicture, setProfilePicture] = useState("https://img.icons8.com/external-becris-lineal-becris/256/external-user-mintab-for-ios-becris-lineal-becris.png")
    const [bannerPicture, setBannerPicture] = useState("https://wallpapers.com/images/hd/peacock-blue-plain-color-9bxl0kw0vw849lpd.jpg")

    const [newProfilePicture, setNewProfilePicture] = useState(null)
    const [newBannerPicture, setNewBannerPicture] = useState(null)


    let navigate = useNavigate();
    const location = useLocation();
    const {username} = useParams()

    const [mainUser, setMainUser] = useState("")
    const [user, setUser] = useState([])
    const [tweets, setTweets] = useState([])

    useEffect(() => {
        getUser(window.location.pathname.substring(1,window.location.pathname.length))
    }, [location]);

    const getUser = (name) => {
        Axios.get(`${api}/getUser`, {
            params: {
                username: name
            }
        })
        .then((response)=> {
            // console.log(response.data)
            if(response.data.profilePicture) {
                setProfilePicture(response.data.profilePicture)
            }
            if(response.data.bannerPicture) {
                setBannerPicture(response.data.bannerPicture)
            }
            response.data.tweets.sort((a,b) => new Date(b.date) - new Date(a.date))
            setUser(response.data)
            setTweets(response.data.tweets)
        })
    }

    useEffect(()=> {
        getUser(username)

        let token = jwt_decode(window.sessionStorage.getItem("token"));
        setMainUser(token.username)
    },[])

    const handleProfileImage = e => {
        if(e.target.files[0].size > 2097152) {
            alert("File is too big!")
            setNewProfilePicture(null)
        } else {
            setNewProfilePicture(e.target.files[0])
            document.getElementById("new-profile").src=window.URL.createObjectURL(e.target.files[0])
        }
    }

    const handleBannerImage = e => {
        if(e.target.files[0].size > 2097152) {
            alert("File is too big!")
            setNewBannerPicture(null)
        } else {
            setNewBannerPicture(e.target.files[0])
            document.getElementById("new-banner").src=window.URL.createObjectURL(e.target.files[0])
        }
    }

    const uploadToS3 = async (item, folder) => {
        if (!item) {
            console.log('no image')
            return;
        }
        // IMPLEMENT DELETING FROM S3 WHEN NEW IMAGE UPLOADED
        const params = { 
            Bucket: process.env.REACT_APP_BUCKET_NAME + folder, 
            Key: `${Date.now()}.${item.name}`, 
            Body: item 
        };
        const { Location, Key } = await s3.upload(params).promise();
        // console.log(Location)
        let obj = {Location, Key}
        return obj
    }

    const handleClose = () => {
        setNewBannerPicture(null)
        setNewProfilePicture(null)
        setShow(false)
    };
    const handleShow = () => setShow(true);

    const deleteS3 = async (key) => {
        var params = { Bucket: process.env.REACT_APP_BUCKET_NAME, Key: key }
        s3.deleteObject(params, function(err, data) {
          // if(err) console.log(err)
          // else console.log(data)
        })
    }
    
    const handleCloseAndUpload = async () => {

        if(newProfilePicture || newBannerPicture) {
            let profile = {Key: "", Location: ""}
            let banner = {Key: "", Location: ""}

            if(newProfilePicture) {
                profile = await uploadToS3(newProfilePicture, "/user-profile")
            }
            if(newBannerPicture) {
                banner = await uploadToS3(newBannerPicture, "/user-banner")
            }

            Axios.put(`${api}/uploadPicture`, { 
                username: mainUser,
                token: window.sessionStorage.getItem("token"),
                profilePicture: profile.Location,
                profileKey: profile.Key,
                bannerPicture: banner.Location,
                bannerKey: banner.Key
            })
            .then((response)=> {
                if(response.data === 'images updated') {
                    if(profile.Location) {
                        setProfilePicture(profile.Location)
                        if(user.profileKey) {
                            deleteS3(user.profileKey)
                        }
                    }
                    if(banner.Location) {
                        setBannerPicture(banner.Location)
                        if(user.bannerKey) {
                            deleteS3(user.bannerKey)
                        }
                    }
                    
                }
            })
        }
        else {
            console.log('nothing uploaded')
        }


        handleClose()
    };

    return(<>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit profile</Modal.Title>
            </Modal.Header>


            <label htmlFor="banner-upload">
                <img src={bannerPicture} style={{width: "100%", height: "150px", cursor: "pointer"}} id="new-banner"/>
            </label>
            <input type="file" accept=".png, .jpg, .jpeg" onChange={handleBannerImage} id="banner-upload" style={{display: "none"}}/>


            <Modal.Body>
            <Stack gap={2}>
                <div style={{marginTop: "-60px", display: "inline"}}>
                    <label htmlFor="profile-upload">
                        <img src={profilePicture} id="new-profile"
                        style={{cursor: "pointer", width: "75px", height: "75px", padding: "5px", backgroundColor: "#fff", borderRadius: "50px"}}/>
                    </label>
                    <input type="file" accept=".png, .jpg, .jpeg" onChange={handleProfileImage} id="profile-upload" style={{display: "none"}}/>
                </div>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder={'@' + mainUser} disabled readOnly/>
                <Form.Label>Bio</Form.Label>
                <Form.Control type="text" placeholder="Description"/>

            </Stack>

            </Modal.Body>



            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleCloseAndUpload} 
                // disabled={newProfilePicture || newBannerPicture}
                >
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>


        <Container fluid style={{color: fontColor}}>
            <Row style={{display: "flex", justifyContent: "center"}}>
                <MenuColumn backgroundColor={backgroundColor}/>
                
                <Col style={{background: backgroundColor, minHeight: "100vh" , padding: 0, borderLeft: `solid 2px ${borderColor}`, borderRight: `solid 2px ${borderColor}`}} lg={6}>
                    { !user ? 
                    "user doesnt exist"
                    :
                    <>
                    <Stack gap={0} style={{padding: "0.5em 1em"}}>
                        <Row>
                            <Col xs={2} lg={1} className="backIcon" onClick={() => navigate(-1)} style={{display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer",}} >
                                <i className="bi bi-arrow-left" style={{fontSize: "2em"}}/>
                            </Col>
                            <Col xs={4} lg={5}>
                                    <Row>
                                        {user.username? <h4 style={{margin: 0}}>{user.username}</h4>:"temp"}
                                    </Row>
                                    <Row>
                                        {user.tweets ? <p style={{margin: 0}}>{user.tweets.length} Tweets</p> : "temp"}
                                    </Row>
                            </Col>
                            <Col xs={6} lg={6}></Col>
                        </Row>
                    </Stack>

                    <img src={bannerPicture} className="profileBanner"/>

                    <Stack  style={{padding: "1em"}}>
                        <div style={{marginTop: "-60px"}}>
                            <img src={profilePicture}
                            // className="profilePicture"
                            style={{color: titleColor, width: "85px", height: "85px", padding: "5px", backgroundColor: backgroundColor, borderRadius: "50px"}}
                            />
                            {/* <i className="bi bi-person-circle" style={{color: titleColor, width: "85px", height: "85px"}} /> */}
                        </div>

                        <Row>
                            <Col>
                                {user.username? <h2>{user.username}</h2>:<></>}
                            </Col>
                            
                            <Col>
                            </Col>

                            <Col style={{display: "flex", alignItems: "center", justifyContent: "right"}}>
                                { username == mainUser ? 
                                <button onClick={handleShow}> Edit Profile </button> :
                                <button> Following/Not Following </button>
                                }
                            </Col>
                        </Row>
                        {/* {user.tweets ? <h5>{user.tweets.length} Tweets</h5> : "temp"} */}
                        <p>Description</p>
                        <Row>
                            <Col xs={4} lg={2}>
                                {user.following?
                                    <Link to="following" className="userFollow">
                                        <p style={{display: "inline",color: fontColor}}>{user.following.length} following</p>
                                    </Link>:<></>}
                            </Col>
                            <Col xs={4} lg={2}>
                                {user.followers?
                                    <Link to="followers" className="userFollow">
                                            <p style={{display: "inline",color: fontColor}}>{user.followers.length} followers</p>
                                    </Link>:<></>}
                            </Col>
                            <Col xs={4} lg={8}></Col>
                        </Row>


                        <Row style={{paddingTop: "2em"}}>
                            <Col>
                                Tweets
                            </Col>
                            {/* <Col>
                                Likes
                            </Col> */}
                        </Row>

                    </Stack>
                    <Row style={{borderBottom: "2px solid black", width: "100%", margin: 0}}></Row>

                    <Container>
                        {tweets.length > 0 &&
                            tweets.map((tweet) => (
                                <Tweet {...tweet} profilePicture={profilePicture} key={tweet._id} username={username} tweetBackground={tweetBackground} tweetTitleColor={tweetTitleColor} tweetTextColor={tweetTextColor}/>
                        ))}
                    </Container>
                    </>
                    }
                </Col>

                <Col style={{background: backgroundColor, position: "fixed", right: 0, minHeight: "100vh"}} className="mobileCol" lg={3}>
                    
                </Col>
            </Row>
        </Container>

        <Footer/>
    </>)
}