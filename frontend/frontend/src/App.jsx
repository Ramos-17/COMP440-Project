import Signup from "./Signup";
import Login from "./login";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

// land on signup page by default, can navigate to login page
function App() { 
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;