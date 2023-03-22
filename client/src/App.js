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
  let theme = {
    api: 'http://localhost:3001',
    backgroundColor: "#232946",
    fontColor: "#fff",
    titleColor: "#fffffe",
    borderColor: "#000",
    tweetBackground: "#fffffe",
    tweetTitleColor: "#232946",
    tweetTextColor: "#232946",
    tweetButtonBackgroundColor: "rgba(35, 41, 70, 0.8)",
    tweetButtonColor: "#b8c1ec"
  }


  return (<>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home theme={theme} />}/>
            <Route path="landing" element={<Landing />} />
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
