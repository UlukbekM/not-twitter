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
  

  return (<>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="landing" element={<Landing />} />
            <Route path=":username" element={<UserPage/>} />
            <Route path=":username/following" element={<UserFollow/>} />
            <Route path=":username/followers" element={<UserFollow/>} />
            <Route path="*" element={<ErrorPage/>} />
          </Routes>
        </BrowserRouter>

        {/* <Landing/> */}
    </>
  );
}

export default App;
