import { useEffect, useState } from 'react';
import client from '../api/client';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const res = await client.get('/cart');
      setCartItems(res.data);
    };
    fetchCart();
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.map(({ product, quantity }) => (
        <div key={product._id} className="p-4 bg-white rounded shadow mb-3">
          <div className="font-semibold">{product.title}</div>
          <div className="text-gray-600">
            ${product.price} x {quantity} = ${product.price * quantity}
          </div>
        </div>
      ))}
      <div className="text-right font-bold mt-4">Total: ${total}</div>
    </div>
  );
}
