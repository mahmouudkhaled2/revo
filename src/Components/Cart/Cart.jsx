import { useState } from 'react';
import { useCart } from '../../Context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthProvider';
import { toast } from 'react-hot-toast';
import { getImageSrc } from '../../utils';

export default function Cart() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    calculateTotals,
    submitOrder,
    clearCart
  } = useCart();
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { restaurant: restaurantId } = useParams();
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

    if (!restaurantId) {
      toast.error('Please select a restaurant');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitOrder(restaurantId, notes);
      setNotes('');
      toast.success('Order placed successfully!');
      setIsCartOpen(false);
      navigate('/orders'); // Redirect to orders page after successful checkout
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-[#F27141] text-white p-4 rounded-full shadow-lg hover:bg-[#e05f35] transition-colors z-50"
      >
        <div className="relative">
          <FaShoppingCart className="text-2xl" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </div>
      </button>

      {/* Cart Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
            />

            {/* Cart Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 bg-[#F27141] text-white flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 hover:opacity-80 transition-opacity"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Your cart is empty
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.itemId}
                        className="flex items-center gap-4 bg-white p-4 rounded-lg shadow"
                      >
                        <img
                          src={getImageSrc(item.image, "/assets/images/placeholder-dish.png")}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-gray-600">{item.price} EGP</p>
                          <div className="flex items-center gap-3 mt-2">
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
                        </div>
                        <button
                          onClick={() => removeFromCart(item.itemId)}
                          className="text-red-500 hover:text-red-600 p-2"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}

                    {/* Order Notes */}
                    <div className="mt-6">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special instructions..."
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27141]"
                        rows="3"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Summary */}
              {cart.length > 0 && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
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
                    disabled={isSubmitting}
                    className={`w-full mt-4 py-3 px-4 bg-[#F27141] text-white rounded-lg font-medium
                      ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e05f35]'}
                      transition-colors`}
                  >
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 