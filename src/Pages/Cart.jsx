import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Cart() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    calculateTotals,
    submitOrder
  } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const { subtotal, tax, total } = calculateTotals();

  const handleSubmitOrder = async () => {
    if (!currentUser) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      await submitOrder(cart[0].restaurantId);
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <h2 className="text-2xl font-semibold text-gray-900">Your Cart is Empty</h2>
        <p className="text-gray-600 text-center max-w-md">
          Browse our restaurants and add some delicious items to your cart!
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-3 bg-[#F27141] text-white rounded-lg hover:bg-[#e05f35] transition-colors"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <motion.div
                key={item.itemId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">{item.price} EGP</p>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                          className="p-1 text-gray-500 hover:text-[#F27141]"
                        >
                          <FaMinus />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-[#F27141]"
                        >
                          <FaPlus />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.itemId)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {(item.price * item.quantity).toFixed(2)} EGP
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (14%)</span>
                  <span>{tax.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>{total.toFixed(2)} EGP</span>
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                className="w-full mt-6 py-3 px-4 bg-[#F27141] text-white rounded-lg font-medium hover:bg-[#e05f35] transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 