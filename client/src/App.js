import './App.css';
import { LogInSignUp } from './Components/LogInSignUp';
import { Home } from './Components/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (<>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="landing" element={<LogInSignUp />} />
          </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
