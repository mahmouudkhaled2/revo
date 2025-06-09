import { useState, useEffect } from 'react';
import { collection, getDocs, getDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../Context/AuthProvider';

export default function FavoriteDishes() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        const favsRef = collection(db, 'users', currentUser.uid, 'favorites');
        const favsSnapshot = await getDocs(favsRef);

        const favoritesWithRestaurants = await Promise.all(
          favsSnapshot.docs.map(async (docSnap) => {
            const favData = docSnap.data();
            const restaurantRef = doc(db, 'restaurants', favData.restaurantId);
            const restaurantDoc = await getDoc(restaurantRef);

            if (!restaurantDoc.exists()) {
              console.error('Restaurant not found:', favData.restaurantId);
              return null;
            }

            return {
              id: docSnap.id,
              ...favData,
              restaurant: {
                id: restaurantDoc.id,
                ...restaurantDoc.data()
              }
            };
          })
        );

        setFavorites(favoritesWithRestaurants.filter(fav => fav !== null));
        console.log('Fetched favorites:', favoritesWithRestaurants);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser, navigate]);

  const handleRemoveFavorite = async (e, dishId) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'favorites', dishId));
      setFavorites((prev) => prev.filter((item) => item.id !== dishId));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F27141]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container max-w-[80%] mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorite Dishes</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">You haven't added any dishes to your favorites yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((dish, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={dish.id}
                className="group bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                onClick={() => navigate(`/for-restaurants/${dish.restaurantId}`)}
                role="button"
                tabIndex={0}
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => handleRemoveFavorite(e, dish.id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform duration-300"
                  >
                    <FaHeart className="text-red-500" />
                  </button>
                </div>

                <div className="text-left">
                  <h3 className="font-Grotesk text-lg font-semibold text-gray-800 mb-2">
                    {dish.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    from{' '}
                    <span className="text-[#F27141] font-medium">
                      {dish.restaurant.name}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {dish.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#F27141] font-semibold">{dish.price} EGP</span>
                    <button
                      className="px-4 py-1.5 bg-[#F27141] text-white text-sm rounded-full hover:bg-[#e05f35] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/for-restaurants/${dish.restaurantId}`);
                      }}
                    >
                      View Restaurant
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
