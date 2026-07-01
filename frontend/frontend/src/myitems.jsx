import { useState } from "react";
// not a requirement but added so that the user who posted an item can see their posted items and the reviews for those items
export default function MyItems() {
  const [username, setUsername] = useState("");
  const [items, setItems] = useState([]);
  const [reviews, setReviews] = useState({});
  const [message, setMessage] = useState("");

  async function handleSearch(event) {
    event.preventDefault();
    if (!username.trim()) {
      setMessage("Please enter your username.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/items/my-items?username=${encodeURIComponent(username)}`
      );
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Failed to fetch items.");
        setItems([]);
        return;
      }

      setItems(result);
      setReviews({});
      setMessage(result.length === 0 ? "You have no posted items." : "");
    } catch {
      setMessage("Could not connect to the backend.");
    }
  }

  async function loadReviews(item_id) {
    if (reviews[item_id]) {
      setReviews({ ...reviews, [item_id]: null });
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/items/${item_id}/reviews`
      );
      const result = await response.json();
      setReviews({ ...reviews, [item_id]: result });
    } catch {
      setMessage("Could not load reviews.");
    }
  }

  return (
    <div>
      <h1>My Posted Items</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">View My Items</button>
      </form>

      <p>{message}</p>

      {items.map((item) => (
        <div key={item.item_id} style={{ border: "1px solid gray", margin: "10px 0", padding: "10px" }}>
          <h3>{item.title}</h3>
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Description:</strong> {item.description}</p>
          <p><strong>Price:</strong> ${item.price}</p>
          <p><strong>Posted:</strong> {item.created_at}</p>

          <button onClick={() => loadReviews(item.item_id)}>
            {reviews[item.item_id] ? "Hide Reviews" : "Show Reviews"}
          </button>

          {reviews[item.item_id] && (
            reviews[item.item_id].length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              <table border="1" cellPadding="8" style={{ marginTop: "8px" }}>
                <thead>
                  <tr>
                    <th>Reviewer</th>
                    <th>Rating</th>
                    <th>Review</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews[item.item_id].map((review, index) => (
                    <tr key={index}>
                      <td>{review.username}</td>
                      <td>{review.rating}</td>
                      <td>{review.description}</td>
                      <td>{review.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      ))}
    </div>
  );
}
