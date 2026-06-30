import { useState } from "react";

export default function PostItem() {
  const [formData, setFormData] = useState({
    username: "",
    title: "",
    category: "",
    description: "",
    price: "",
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

    const { username, title, category, description, price } = formData;
    if (!username || !title || !category || !description || !price) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Failed to post item.");
        return;
      }

      setMessage(result.message);
      setFormData({ username: "", title: "", category: "", description: "", price: "" });
    } catch {
      setMessage("Could not connect to the backend.");
    }
  }

  return (
    <div>
      <h1>Post an Item</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Your username"
          value={formData.username}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="title"
          placeholder="Item title"
          value={formData.title}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />
        <br /><br />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Post Item</button>
      </form>

      <p>{message}</p>
    </div>
  );
}
