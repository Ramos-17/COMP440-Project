import Signup from "./Signup";
import Login from "./login";
import PostItem from "./item";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SearchItems from "./search";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />
        <Route path="/item" element={<PostItem />} />
        <Route path="/search" element={<SearchItems />} />
      </Routes>
    </Router>
  );
}

export default App;