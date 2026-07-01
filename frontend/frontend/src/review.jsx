import { useState } from "react";
import { useSearchParams } from "react-router-dom";

// ineterface for review form
//all criteria from phase 2 are good
export default function Review() {
  const [searchParams] = useSearchParams();
  const item_id = searchParams.get("item_id") || "";

  const [formData, setFormData] = useState({
    username: "",
    rating: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const { username, rating, description } = formData;
    if (!username || !rating || !description) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/items/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, item_id }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Failed to submit review.");
        return;
      }

      setMessage(result.message);
      setFormData({ username: "", rating: "", description: "" });
    } catch {
      setMessage("Could not connect to the backend.");
    }
  }

  return (
    <div>
      <h1>Leave a Review</h1>
      <p>Reviewing Item ID: <strong>{item_id}</strong></p>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Your username"
          value={formData.username}
          onChange={handleChange}
        />
        <br /><br />

        <label>Rating:</label>
        <br />
        <select name="rating" value={formData.rating} onChange={handleChange}>
          <option value="">-- Select a rating --</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
        <br /><br />

        <textarea
          name="description"
          placeholder="Write a review"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          cols="40"
        />
        <br /><br />

        <button type="submit">Submit Review</button>
      </form>

      <p>{message}</p>
    </div>
  );
}
