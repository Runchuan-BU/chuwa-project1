import { useEffect, useState } from 'react';
import client from '../api/client';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await client.get('/products');
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <ul className="space-y-3">
        {products.map((p) => (
          <li key={p._id} className="p-4 bg-white rounded shadow">
            <div className="font-semibold">{p.title}</div>
            <div className="text-gray-600">${p.price}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}