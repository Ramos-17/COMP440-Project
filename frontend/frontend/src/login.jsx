import { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "", // init username
    password: "", // init password
  });

  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null); // init for user state for login landing success

  function handleChange(event) { // handle input change
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.username || !formData.password) {
      setMessage("Username and password are required.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", { // api call
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json(); 

      if (!response.ok) {
        setMessage(result.error || "Login failed."); //message if login fails
        return;
      }

      setUser(result.user);
      setMessage(result.message);
    } catch {
      setMessage("Could not connect to the backend."); // message if backend is the issue
    }
  }

  if (user) { //when user is logged in, show welcome message
    return (
      <div>
        <h1>Login Successful</h1> 
        <p>Welcome, {user.first_name || user.username}</p>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <button onClick={() => setUser(null)}>Log out</button>
      </div>
    );
  }

  return ( //login form
    <div>
      <h1>User Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">Login</button>
      </form>

      <p>{message}</p>
    </div>
  );
}
