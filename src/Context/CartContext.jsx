/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase-config';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { currentUser } = useAuth();
  const TAX_RATE = 0.14;

  // Load cart from Firestore when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser) return;
      try {
        const snapshot = await getDocs(collection(db, 'users', currentUser.uid, 'cart'));
        const items = snapshot.docs.map(doc => ({ ...doc.data(), itemId: doc.id }));
        setCart(items);
      } catch (error) {
        console.error('Error loading cart from Firestore:', error);
      }
    };
    fetchCart();
  }, [currentUser]);

  const addToCart = async (item) => {
    if (!currentUser) {
      toast.error("You must be logged in to add items to cart");
      return;
    }

    const existingItem = cart.find((i) => i.itemId === item.itemId);
    let newCart;

    if (existingItem) {
      newCart = cart.map((i) =>
        i.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newCart = [...cart, { ...item, quantity: 1 }];
    }

    setCart(newCart);

    try {
      const itemRef = doc(db, 'users', currentUser.uid, 'cart', item.itemId);
      await setDoc(itemRef, {
        ...item,
        quantity: existingItem ? existingItem.quantity + 1 : 1,
        addedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving cart item to Firestore:", error);
    }

    toast.success('Added to cart!');
  };

  const removeFromCart = async (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.itemId !== itemId));
    if (currentUser) {
      try {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'cart', itemId));
      } catch (error) {
        console.error('Error deleting item from Firestore cart:', error);
      }
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    const item = cart.find((i) => i.itemId === itemId);
    if (!item) return;

    if (newQuantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    const updatedCart = cart.map((i) =>
      i.itemId === itemId ? { ...i, quantity: newQuantity } : i
    );
    setCart(updatedCart);

    if (currentUser) {
      try {
        const itemRef = doc(db, 'users', currentUser.uid, 'cart', itemId);
        await setDoc(itemRef, {
          ...item,
          quantity: newQuantity,
          addedAt: serverTimestamp()
        });
      } catch (error) {
        console.error("Error updating cart item in Firestore:", error);
      }
    }
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const clearCart = async () => {
    setCart([]);
    if (currentUser) {
      try {
        const snapshot = await getDocs(collection(db, 'users', currentUser.uid, 'cart'));
        const deletions = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
        await Promise.all(deletions);
      } catch (error) {
        console.error('Error clearing Firestore cart:', error);
      }
    }
  };

  const submitOrder = async (restaurantId, notes = '') => {
    if (!currentUser) throw new Error('User must be logged in to place an order');
    if (cart.length === 0) throw new Error('Cart is empty');

    const { subtotal, tax, total } = calculateTotals();

    const restaurantDoc = await getDoc(doc(db, 'restaurants', restaurantId));
    if (!restaurantDoc.exists()) {
      throw new Error('Restaurant not found');
    }

    const orderData = {
      customerId: currentUser.uid,
      customerName: currentUser.displayName || 'Anonymous',
      customerEmail: currentUser.email,
      restaurantId,
      restaurantName: restaurantDoc.data().name,
      items: cart.map(item => ({
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal,
      tax,
      total,
      notes,
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    try {
      const userOrderRef = await addDoc(
        collection(db, 'users', currentUser.uid, 'orders'),
        orderData
      );

      await setDoc(
        doc(db, 'restaurants', restaurantId, 'orders', userOrderRef.id),
        orderData
      );

      await clearCart();
      return userOrderRef.id;
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    }
  };

  const value = {
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotals,
    submitOrder,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}