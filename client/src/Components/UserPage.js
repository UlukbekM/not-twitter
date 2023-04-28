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
import { TweetForm } from './TweetForm';


export const UserPage = (props) => {
    const {contentBackgroundColor, backgroundColor, api, fontColor, titleColor, borderColor, tweetBackground, tweetTitleColor, tweetTextColor, tweetButtonBackgroundColor, tweetButtonColor} = props.theme

    const s3 = new AWS.S3();
    // console.log(props)

    let defaultBanner = "https://el-ninho.com/wp-content/uploads/2013/11/black-background-ppt-backgrounds-powerpoint-1024x6402.jpg"

    const [show, setShow] = useState(false);

    const [profilePicture, setProfilePicture] = useState("https://img.icons8.com/external-becris-lineal-becris/256/external-user-mintab-for-ios-becris-lineal-becris.png")
    const [bannerPicture, setBannerPicture] = useState(defaultBanner)

    const [newProfilePicture, setNewProfilePicture] = useState(null)
    const [newBannerPicture, setNewBannerPicture] = useState(null)
    const [newDescription, setNewDescription] = useState(null)

    const [following, setFollowing] = useState(false)
    const [userExists, setUserExists] = useState(true)


    let navigate = useNavigate();
    const location = useLocation();
    const {username} = useParams()

    const [mainUser, setMainUser] = useState("")
    const [user, setUser] = useState([])
    const [tweets, setTweets] = useState([])

    const [bannerKey, setBannerKey] = useState("")

    useEffect(() => {
        // console.log(window.location.pathname.substring(1,window.location.pathname.length))
        getUser(window.location.pathname.substring(1,window.location.pathname.length))
    }, [location]);

    const getUser = (name) => {
        setUserExists(true)

        Axios.get(`${api}/getUser`, {
            params: {
                username: name
            }
        })
        .then((response)=> {
            console.log(response.data)
            if(response.data === "") {
                setUserExists(false)
            } else {
                if(response.data.profilePicture) {
                    setProfilePicture(response.data.profilePicture)
                }
                if(response.data.bannerPicture) {
                    setBannerPicture(response.data.bannerPicture)
                }
                if(response.data.bannerKey) {
                    setBannerKey(response.data.bannerKey)
                }
                response.data.tweets.sort((a,b) => new Date(b.date) - new Date(a.date))
                setUser(response.data)
                setTweets(response.data.tweets)
            }
        })
    }

    useEffect(()=> {
        getUser(username)

        let token = jwt_decode(window.sessionStorage.getItem("token"));
        setMainUser(token.username)
        if(username !== token.username) getFollowing()
    },[])

    const getFollowing = () => {
        let token = jwt_decode(window.sessionStorage.getItem("token"));
        Axios.get(`${api}/checkFollowing`, {
            params: {
                user: username,
                follower: token.username
            }
        })
        .then((response)=> {
            setFollowing(response.data)
        })
    }

    const handleProfileImage = e => {
        if(e.target.files[0].size > 2097152) {
            alert("File is too big!")
            setNewProfilePicture(null)
        } else {
            setNewProfilePicture(e.target.files[0])
            // document.getElementById("new-profile").src=window.URL.createObjectURL(e.target.files[0])
            document.getElementById("uploadProfile").style.backgroundImage=`url(${window.URL.createObjectURL(e.target.files[0])})`
        }
    }

    const handleBannerImage = e => {
        if(e.target.files[0].size > 2097152) {
            alert("File is too big!")
            setNewBannerPicture(null)
        } else {
            setNewBannerPicture(e.target.files[0])
            // document.getElementById("new-banner").src=window.URL.createObjectURL(e.target.files[0])
            document.getElementById("uploadBanner").style.backgroundImage=`url(${window.URL.createObjectURL(e.target.files[0])})`
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
            Key: `${mainUser}.${Date.now()}.${item.name}`, 
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
    const handleShow = () => {
        setShow(true)
    };

    const deleteS3 = async (key) => {
        var params = { Bucket: process.env.REACT_APP_BUCKET_NAME, Key: key }
        s3.deleteObject(params, function(err, data) {
            if(err) console.log(err)
            else console.log(data)
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
                window.sessionStorage.setItem("token", response.data[0]);

                if(response.data[1] === 'images updated') {
                    if(profile.Location) {
                        setProfilePicture(profile.Location)
                        if(user.profileKey) {
                            deleteS3(user.profileKey)
                        }
                    }
                    if(banner.Location) {
                        setBannerPicture(banner.Location)
                        setBannerKey(banner.Key)
                        if(bannerKey) {
                            deleteS3(bannerKey)
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


    const followUser = () => {
        let token = jwt_decode(window.sessionStorage.getItem("token"));
        Axios.put(`${api}/followUser`, {
            follower: token.username,
            following: username
        }).then((response)=> {
            if(response.data === "user followed") {
                setFollowing(!following)
            }
        })
    }

    const unfollowUser = () => {
        let token = jwt_decode(window.sessionStorage.getItem("token"));
        Axios.put(`${api}/unfollowUser`, {
            unfollower: token.username,
            target: username,
            // token: token
        }).then((response)=> {
            if(response.data === "user unfollowed") {
                setFollowing(!following)
            }
        })
    }

    const deleteBanner = () => {
        // console.log(user.bannerKey)

        Axios.put(`${api}/removeBanner`, {
            username: user.username,
            // token: token
        }).then((response)=> {
            if(response.data === 'banner removed') {
                deleteS3(bannerKey)
                setBannerKey("")
                setNewBannerPicture(defaultBanner)
                setBannerPicture(defaultBanner)
            }
        })


    }

    
    const [showTweetModal, setShowTweetModal] = useState(false);
    const handleCloseTweetModal = () => setShowTweetModal(false);
    const handleShowTweetModal = () => {setShowTweetModal(true)};

    return(<>
        <Modal show={showTweetModal} onHide={handleCloseTweetModal}>
            <Modal.Header closeButton>
            <Modal.Title>Tweet</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <TweetForm theme={props.theme} user={user.username} mode="modal" handleClose={()=>handleCloseTweetModal()}/>
            </Modal.Body>
        </Modal>



        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit profile</Modal.Title>
            </Modal.Header>

            <div  style={{width: "100%", height: "150px", display: "flex", justifyContent: "space-around", alignItems: "center", backgroundImage: `url(${bannerPicture})`, backgroundSize: "100% 100%"}}  id="uploadBanner">
                <label htmlFor="banner-upload" className="uploadImageModalIcons">
                    <i className="bi bi-camera"/>
                </label>

                {bannerKey &&                 
                <div className="uploadImageModalIcons" onClick={deleteBanner}>
                    <i className="bi bi-x"/>
                </div>}

            </div>
            
            <input type="file" accept=".png, .jpg, .jpeg" onChange={handleBannerImage} id="banner-upload" style={{display: "none"}}/>


            <Modal.Body>
            <Stack gap={2}>
                {/* <div style={{marginTop: "-50px", display: "inline"}}>
                    <label htmlFor="profile-upload">
                        <img src={profilePicture} id="new-profile"
                        style={{cursor: "pointer", width: "75px", height: "75px", padding: "5px", backgroundColor: "#fff", borderRadius: "50px"}}/>
                    </label>
                </div> */}

                <div style={{marginTop: "-50px", display: "inline"}}>
                    <div style={{backgroundColor: "#fff", padding: "0.5em", display: "inline-block", borderRadius: "50%"}}>
                        <label className="uploadImageModalIcons" style={{backgroundColor: "#fff", padding: "0.5em", borderRadius: "50%", backgroundImage: `url(${profilePicture})`, backgroundSize: "100% 100%" }} htmlFor="profile-upload" id="uploadProfile">
                            <i className="bi bi-camera" style={{opacity: 1}}/>
                        </label>
                        <input type="file" accept=".png, .jpg, .jpeg" onChange={handleProfileImage} id="profile-upload" style={{display: "none"}}/>
                    </div>
                </div>


                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder={'@' + mainUser} disabled readOnly/>
                <Form.Label>Bio</Form.Label>
                <Form.Control type="text" placeholder="Description"/>

            </Stack>

            </Modal.Body>



            <Modal.Footer>
                {/* <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button> */}
                {/* <Button variant="primary" onClick={handleCloseAndUpload}>
                    Save Changes
                </Button> */}
                <button className="tweetButton" onClick={handleCloseAndUpload} 
                // disabled={!newProfilePicture || !newBannerPicture}
                >Save Changes</button>
            </Modal.Footer>
        </Modal>


        <Container fluid style={{color: fontColor}}>
            <Row style={{display: "flex", justifyContent: "center"}}>
                <MenuColumn theme={props.theme} handleShow={()=>handleShowTweetModal()} profilePicture={profilePicture}/>
                
                <Col style={{background: backgroundColor, minHeight: "100vh" , padding: 0, borderLeft: `solid 2px ${borderColor}`, borderRight: `solid 2px ${borderColor}`}} lg={6}>
                    { !userExists ? 
                    <div style={{display: "grid", placeItems: "center", height: "100%"}}>
                        <h2>User doesn't exist</h2>
                    </div>
                    :
                    <>
                    <Stack gap={0} style={{padding: "0.5em 1em"}}>
                        <Row>
                            <Col xs={2} lg={1} className="backIcon" onClick={() => navigate(-1)} style={{display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer",}} >
                                <i className="bi bi-arrow-left" style={{fontSize: "2em"}}/>
                            </Col>
                            <Col xs={4} lg={5}>
                                    <Row>
                                        {user.username? <h4 style={{margin: 0}}>{user.username}</h4>:"User"}
                                    </Row>
                                    <Row>
                                        {user.tweets ? <p style={{margin: 0}}>{user.tweets.length} Tweets</p> : "Tweets"}
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
                            <Col xs={4}>
                                {user.username? <h2>{user.username}</h2>:<></>}
                            </Col>
                            
                            <Col xs={2}>
                            </Col>

                            <Col xs={6} style={{display: "flex", alignItems: "center", justifyContent: "right"}}>
                                { userExists &&  
                                
                                    username == mainUser ? 
                                    // <button onClick={handleShow}> Edit Profile </button>
                                    
                                    <button className="profileEditButton" onClick={handleShow}> Edit Profile </button>
                                    :
                                    following ? 
                                    <Button variant="light" onClick={unfollowUser} style={{borderRadius: "20px", padding: "5px 15px", fontWeight: "600"}} > Unfollow </Button> :
                                    <Button variant="light" onClick={followUser} style={{borderRadius: "20px", padding: "5px 15px", fontWeight: "600"}} > Follow </Button>
                                        
                                
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

        <Footer theme={props.theme}/>
    </>)
}