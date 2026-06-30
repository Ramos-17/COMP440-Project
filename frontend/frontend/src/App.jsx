import Signup from "./Signup";
import Login from "./login";
import PostItem from "./item";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />
        <Route path="/item" element={<PostItem />} />
      </Routes>
    </Router>
  );
}

export default App;