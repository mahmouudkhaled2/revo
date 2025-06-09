/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import MenuCarousel from "../Components/Restaurant/menu-carousel";
import SectionHeading from "../Components/Restaurant/section-heading";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../Context/AuthProvider";
import { useCart } from '../Context/CartContext';
import { toast } from 'react-hot-toast';

export default function MenuSection({ restaurantId }) {
  const [favorites, setFavorites] = useState(new Set());
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const menuRef = collection(db, 'restaurants', restaurantId, 'menu');
        const q = query(menuRef, orderBy('createdAt', 'desc'));
        const menuSnapshot = await getDocs(q);
        
        const items = menuSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setMenuItems(items);

        // Extract unique categories
        const uniqueCategories = [...new Set(items.map(item => item.category))];
        setCategories(['all', ...uniqueCategories]);

        // Fetch user's favorites if logged in
        if (currentUser) {
          const userFavsRef = collection(db, 'users', currentUser.uid, 'favorites');
          const favsSnapshot = await getDocs(userFavsRef);
          const userFavorites = new Set(
            favsSnapshot.docs
              .filter(doc => !doc.data()._init)
              .map(doc => doc.id)
          );
          setFavorites(userFavorites);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchMenuItems();
    }
  }, [restaurantId, currentUser]);

  const toggleFavorite = async (dish) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      const favRef = doc(db, 'users', currentUser.uid, 'favorites', dish.id);
      
      if (favorites.has(dish.id)) {
        await deleteDoc(favRef);
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(dish.id);
          return newFavorites;
        });
        toast.success('Removed from favorites');
      } else {
        await setDoc(favRef, {
          ...dish,
          addedAt: new Date(),
          restaurantId
        });
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.add(dish.id);
          return newFavorites;
        });
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error('Failed to update favorites');
    }
  };

  const handleAddToCart = (item) => {
    addToCart({
      itemId: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });
  };

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <section id="menu" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 py-16 border-y">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F27141]"></div>
      </section>
    );
  }

  return (
    <section id="menu" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 py-16 border-y">
      <div className="container max-w-[80%] mx-auto text-center">
        <SectionHeading title={"Our Menu"} />
        <MenuCarousel restaurantId={restaurantId} onCategorySelect={setSelectedCategory} />

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mt-12 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${selectedCategory === category 
                  ? 'bg-[#F27141] text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              No dishes available in this category
            </div>
          ) : (
            filteredItems.map((item, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={item.id}
                className="group bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img 
                    src={item.image || '/assets/placeholder-food.jpg'} 
                    alt={item.name} 
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item);
                    }}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform duration-300"
                  >
                    {favorites.has(item.id) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Dish Info */}
                <div className="text-left">
                  <h3 className="font-Grotesk text-lg font-semibold text-gray-800 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#F27141] font-semibold">{item.price} EGP</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="px-4 py-1.5 bg-[#F27141] text-white text-sm rounded-full hover:bg-[#e05f35] transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}