import { useState } from 'react';
import client from '../api/client';

export default function ProductForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/products', { title, price });
      alert('Product added');
      onSuccess?.();
    } catch (err) {
      alert('Failed to add product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 mt-10 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 mb-3 border rounded"
        required
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
        Add Product
      </button>
    </form>
  );
}
