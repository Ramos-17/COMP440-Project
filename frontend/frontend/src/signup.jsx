import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone
    ) {
      setMessage("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Registration failed.");
        return;
      }

      setMessage(result.message);
    } catch {
      setMessage("Could not connect to the backend.");
    }
  }

  return (
    <div>
      <h1>User Registration</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Sign Up</button>
      </form>

      <button onClick={() => navigate("/login")}>Go to Login</button>

      <br /><br />

      <p>{message}</p>
    </div>
  );
}

export default Signup;
