import './App.css';
import { Home } from './Components/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Landing } from './Components/Landing';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (<>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="landing" element={<Landing />} />
          </Routes>
        </BrowserRouter>

        {/* <Landing/> */}
    </>
  );
}

export default App;
