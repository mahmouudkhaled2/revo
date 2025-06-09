import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaClock, FaSearch } from 'react-icons/fa';

// Custom hook for debounced value
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function ForRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const navigate = useNavigate();

  // Debounce search input with 300ms delay
  const debouncedSearchTerm = useDebounce(searchInput, 300);

  const getAllRestaurants = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "restaurants"));
      const allRestaurants = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRestaurants(allRestaurants);

      // Extract unique cuisine types
      const uniqueCuisines = [...new Set(allRestaurants.map(restaurant => 
        restaurant.cuisineType?.toLowerCase()).filter(Boolean))];
      setCuisineTypes(uniqueCuisines);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllRestaurants();
  }, []);

  // Memoize filter function to prevent unnecessary recalculations
  const getFilteredRestaurants = useCallback((searchTerm, cuisine, allRestaurants) => {
    return allRestaurants.filter(restaurant => {
      const matchesSearch = searchTerm === '' || 
        restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCuisine = cuisine === '' || 
        restaurant.cuisineType?.toLowerCase() === cuisine.toLowerCase();

      return matchesSearch && matchesCuisine;
    });
  }, []);

  // Get filtered restaurants using debounced search term
  const filteredRestaurants = getFilteredRestaurants(debouncedSearchTerm, selectedCuisine, restaurants);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F27141]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Discover Amazing Restaurants</h1>
        
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F27141] focus:border-transparent outline-none"
            />
          </div>

          {/* Cuisine Filter */}
          <div className="md:w-64">
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F27141] focus:border-transparent outline-none appearance-none"
            >
              <option value="">All Cuisines</option>
              {cuisineTypes.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-gray-600">
          Found {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => navigate(`/for-restaurants/${restaurant.id}`)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              {/* Restaurant Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={restaurant.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'}
                  alt={restaurant.name}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-700 shadow-lg">
                  {restaurant.cuisineType}
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{restaurant.name}</h2>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-gray-700">{restaurant.rating}</span>
                    <span className="text-gray-400 text-sm ml-1">({restaurant.reviewCount})</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{restaurant.description}</p>

                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{restaurant.address}</span>
                </div>

                <div className="flex items-center text-gray-500 text-sm">
                  <FaClock className="mr-2" />
                  <span>{restaurant.openingHours}</span>
                </div>

                {restaurant.status === 'active' ? (
                  <span className="inline-block mt-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Open
                  </span>
                ) : (
                  <span className="inline-block mt-3 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                    Closed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            {debouncedSearchTerm || selectedCuisine ? 
              'No restaurants found matching your search criteria' : 
              'No restaurants available at the moment'
            }
          </div>
        )}
      </div>
    </div>
  );
}
