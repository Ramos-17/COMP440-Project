import { useState } from "react";

export default function SearchItems() {
  const [category, setCategory] = useState("");
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  async function handleSearch(event) {
    event.preventDefault();

    if (!category.trim()) {
      setMessage("Please enter a category.");
      setItems([]);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/items/search?category=${encodeURIComponent(category)}`
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Search failed.");
        setItems([]);
        return;
      }

      setItems(result);
      setMessage(result.length === 0 ? "No items found." : "");
    } catch {
      setMessage("Could not connect to the backend.");
      setItems([]);
    }
  }

  return (
    <div>
      <h1>Search Items by Category</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <p>{message}</p>

      {items.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Title</th>
              <th>Category</th>
              <th>Description</th>
              <th>Price</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.item_id}>
                <td>{item.item_id}</td>
                <td>{item.username}</td>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>{item.description}</td>
                <td>${item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}