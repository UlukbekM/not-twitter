import './App.css';
import { Home } from './Components/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Landing } from './Components/Landing';
import { UserPage } from './Components/UserPage';
import { ErrorPage } from './Components/ErrorPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserFollow } from './Components/UserFollow';
import { Status } from './Components/Status';
import { S3Upload } from './AWS/S3Upload';

function App() {
  let backend = 'http://localhost:3001'
  if(window.location.host !== 'localhost:3000') {
    backend = process.env.REACT_APP_BACKEND_API
  }

  // console.log(backend)
  // console.log(process.env.REACT_APP_BACKEND_API)

  //menucolumn picture update on upload
  //userpage gettweets when tweet
  //suggestedusers add profile pic in api call

  let theme = {
    api: backend,
    backgroundColor: "#232946",
    formBackgroundColor: "#eebbc3",
    contentBackgroundColor: "rgba(63, 68, 93, 0.5)",
    fontColor: "#fff",
    titleColor: "#fffffe",
    borderColor: "#000",
    tweetBackground: "#fffffe",
    tweetTitleColor: "#232946",
    tweetTextColor: "#232946",
    tweetButtonBackgroundColor: "rgba(35, 41, 70, 0.8)",
    tweetButtonColor: "#eebbc3",
    // buttonColor: "#eebbc3",
    buttonFontColor: "#232946",
    paragraphColor: "#b8c1ec"
  }


  return (<>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home theme={theme} />}/>
            <Route path="landing" element={<Landing theme={theme} />}/>
            <Route path=":username" element={<UserPage theme={theme}/>} />
            <Route path=":username/following" element={<UserFollow theme={theme}/>} />
            <Route path=":username/followers" element={<UserFollow theme={theme}/>} />
            <Route path=":username/status/:id" element={<Status theme={theme}/>} />
            <Route path="*" element={<ErrorPage/>} />
          </Routes>
        </BrowserRouter>

        {/* <S3Upload/> */}
    </>
  );
}

export default App;
