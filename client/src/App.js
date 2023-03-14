import './App.css';
import { Home } from './Components/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Landing } from './Components/Landing';
import { UserPage } from './Components/UserPage';
import { ErrorPage } from './Components/ErrorPage';
// import { FollowersPage } from './Components/FollowersPage';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { FollowingPage } from './Components/FollowingPage';
import { UserFollow } from './Components/UserFollow';

function App() {
  
  const api = 'http://localhost:3001'
  const backgroundColor = "#232946"
  const fontColor = "#fff"
  const titleColor = "#fffffe"
  const borderColor ="#000"
  const tweetBackground = "#fffffe"
  const tweetTitleColor = "#232946"
  const tweetTextColor = "#232946"

  let theme = {
    api: 'http://localhost:3001',
    backgroundColor: "#232946",
    fontColor: "#fff",
    titleColor: "#fffffe",
    borderColor: "#000",
    tweetBackground: "#fffffe",
    tweetTitleColor: "#232946",
    tweetTextColor: "#232946",
  }


  return (<>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home theme={theme} />}/>
            <Route path="landing" element={<Landing />} />
            <Route path=":username" element={<UserPage theme={theme}/>} />
            <Route path=":username/following" element={<UserFollow theme={theme}/>} />
            <Route path=":username/followers" element={<UserFollow theme={theme}/>} />
            <Route path="*" element={<ErrorPage/>} />
          </Routes>
        </BrowserRouter>

        {/* <Landing/> */}
    </>
  );
}

export default App;
