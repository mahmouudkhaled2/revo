import { NavLink, useNavigate } from "react-router-dom";
import logo from "./../assets/images/revo-logo.png";
import { useContext, useState, useRef, useEffect } from "react";
import { authContext } from "../Context/AuthProvider";
import { FaHeart, FaShoppingBag, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { getImageSrc } from "../utils";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { userToken, currentUser, logout } = useContext(authContext);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch user name from Firestore
  useEffect(() => {
    const fetchUserName = async () => {
      if (!currentUser?.uid) {
        setUserName("");
        return;
      }

      try {
        const userDoc = doc(db, "users", currentUser.uid); // Reference user document
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserName(userData.name || "User");
          setUserImage(userData.image)
        } else {
          console.error("No user document found!");
          setUserName(currentUser?.displayName || "User");
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
        setUserName(currentUser?.displayName || "");
      }
      };

    fetchUserName();
  }, [currentUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      <nav className="bg-[#F27141] fixed w-full h-[80px] sm:h-[90px] z-50 top-0 left-0 flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:max-w-[80%]">
          <div className="h-full flex items-center justify-between">
            <NavLink to="/">
              <img src={logo} alt="Revo Logo" className="w-28 sm:w-32 lg:w-36" />
            </NavLink>

            <div className="flex items-center gap-3 sm:gap-5 md:order-2">
              {userToken ? (
                <>
                  {/* User Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-1 sm:gap-2 text-white hover:opacity-90 transition-opacity"
                    >
                      <FaChevronDown className={`text-sm transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                      {/* <FaUserCircle className="text-xl sm:text-2xl" /> */}
                      <span className="hidden sm:block text-sm sm:text-base">
                        {userName}
                      </span>
                      <img src={getImageSrc(userImage, "/assets/images/default-user.png")} alt="" className="size-9 rounded-full" />
                    </button>

                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                        >
                          <NavLink
                            to="/favorites"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowDropdown(false)}
                          >
                            <FaHeart className="text-[#F27141]" />
                            <span>Favorites</span>
                          </NavLink>
                          <NavLink
                            to="/orders"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowDropdown(false)}
                          >
                            <FaShoppingBag className="text-[#F27141]" />
                            <span>Orders</span>
                          </NavLink>
                          <hr className="my-2 border-gray-200" />
                          <button
                            onClick={() => {
                              setShowDropdown(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                          >
                            <span>Logout</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-white font-medium rounded-xl border-[1.5px] border-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 text-center"
                >
                  Login / Signup
                </button>
              )}

              <button
                data-collapse-toggle="navbar-sticky"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-[#e05f35] focus:outline-none focus:ring-2 focus:ring-white"
                aria-controls="navbar-sticky"
                aria-expanded={showMenu}
                onClick={() => setShowMenu(!showMenu)}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                </svg>
              </button>
            </div>

            <div
              className={`absolute left-0 right-0 top-[80px] sm:top-[90px] bg-[#F27141] md:bg-transparent md:static md:flex md:w-auto md:order-1 transition-all duration-300 ${
                showMenu ? 'block' : 'hidden'
              }`}
              id="navbar-sticky"
            >
              <ul className="flex flex-col p-4 md:p-0 font-medium md:space-x-6 lg:space-x-8 md:flex-row md:mt-0">
                {[
                  { to: "/", label: "Home" },
                  { to: "/posts", label: "Posts" },
                  { to: "/for-restaurants", label: "Restaurants" },
                  { to: "/contact", label: "Contact" },
                ].map((item) => (
                  <li key={item.to} className="py-3 px-3 md:p-0 text-center">
                    <NavLink
                      to={item.to}
                      onClick={() => setShowMenu(false)}
                      className={({ isActive }) =>
                        `block relative text-white rounded text-base sm:text-lg lg:text-xl transition-colors ${
                          isActive ? 'font-bold underline' : 'hover:opacity-90'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-[80px] sm:h-[90px]"></div>
    </>
  );
}