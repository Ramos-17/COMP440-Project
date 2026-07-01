import Signup from "./Signup";
import Login from "./login";
import PostItem from "./item";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SearchItems from "./search";
import Review from "./review";
import MyItems from "./myitems";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />
        <Route path="/item" element={<PostItem />} />
        <Route path="/search" element={<SearchItems />} />
        <Route path="/review" element={<Review />} />
        <Route path="/my-items" element={<MyItems />} />
      </Routes>
    </Router>
  );
}

export default App;