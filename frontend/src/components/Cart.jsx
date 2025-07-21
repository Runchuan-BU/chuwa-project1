import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store';

export default function Cart() {
  const { items } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  // Calculate total from items
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    } else {
      dispatch(removeFromCart(productId));
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
          <p className="text-gray-400 mt-2">Add some products to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-20 h-20 object-cover rounded-md"
            />
            
            <div className="flex-1 ml-4">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-600">${item.price}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                -
              </button>
              
              <span className="font-semibold min-w-[2rem] text-center">
                {item.quantity}
              </span>
              
              <button
                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                +
              </button>
            </div>
            
            <div className="ml-6 text-right">
              <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => handleRemoveItem(item.productId)}
                className="text-red-500 hover:text-red-700 text-sm mt-1"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold">Total:</span>
          <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
        </div>
        
        <button className="w-full mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
} 