/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import AboutRestaurantSection from "../Components/Restaurant/about-restuarant";
import SectionHeading from "../Components/Restaurant/section-heading";
import MenuSection from "./RestaurantMenu";
import { MdEmail } from "react-icons/md";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import Cart from "../Components/Cart/Cart";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getImageSrc } from "../utils";
import { Helmet } from "react-helmet";
import ReviewsSection from "../Components/Restaurant/ReviewsSection";
// NavItem component
const NavItem = ({ label, href, active = false }) => {
  const handleClick = (e) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const yOffset = -170;
      const y =
        targetElement.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <motion.a
      href={href}
      onClick={handleClick}
      className="text-white hover:opacity-80 transition-all py-2 text-sm md:text-base relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-[#F27141] w-full"
        initial={false}
        animate={{
          scaleX: active ? 1 : 0,
          opacity: active ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.a>
  );
};

// RestaurantNavbar component
const RestaurantNavbar = ({ activeSection, restaurantData }) => {
  const [showMenu, setShowMenu] = useState(false);

  const navItems = [
    { label: "About Us", href: "#about", id: "about" },
    { label: "Menu", href: "#menu", id: "menu" },
    { label: "Reviews", href: "#reviews", id: "reviews" },
    { label: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <header className="bg-black/80 backdrop-blur-sm fixed w-full z-30">
      <nav className="container xl:max-w-[80%] mx-auto py-4 px-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <img
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              src={getImageSrc(
                restaurantData?.logoUrl,
                "/assets/images/default-restaurant-logo.png"
              )}
              alt={`${restaurantData?.name} Logo`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-white text-xl font-medium">
              {restaurantData?.name}
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-10 space-x-8">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                label={item.label}
                href={item.href}
                active={activeSection === item.id}
              />
            ))}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setShowMenu(!showMenu)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {showMenu ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4"
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <NavItem
                    key={item.id}
                    label={item.label}
                    href={item.href}
                    active={activeSection === item.id}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

// HeroSection component
const HeroSection = ({ restaurantData }) => {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <img
          src={getImageSrc(
            restaurantData?.coverUrl || restaurantData?.image,
            "/assets/default-cover.jpg"
          )}
          alt="Restaurant Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 capitalize"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {restaurantData?.name}
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {restaurantData?.slogan ||
            "Experience the finest traditional cuisine with a modern twist"}
        </motion.p>
      </motion.div>
    </div>
  );
};

// Fix for Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ContactSection component
const ContactSection = ({ restaurantData, locationOnMap }) => {
  // Use locationOnMap if provided, otherwise fall back to restaurantData.geoLocation
  const lat = locationOnMap?.lat ?? restaurantData?.geoLocation?._lat;
  const long = locationOnMap?.long ?? restaurantData?.geoLocation?._long;
  const hasValidCoords =
    lat !== undefined && long !== undefined && !isNaN(lat) && !isNaN(long);

  return (
    <section
      id="contact"
      className="min-h-screen py-16 bg-white relative overflow-hidden"
    >
      <div className="container xl:max-w-[80%] mx-auto px-4">
        <SectionHeading title="Contact Us" />

        <div className="grid md:grid-cols-2 gap-12 mt-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold text-gray-900">Get in Touch</h3>
            <p className="text-gray-600">
              {
                "We'd love to hear from you. Please feel free to contact us for any inquiries."
              }
            </p>

            <div className="space-y-6">
              {restaurantData?.email && (
                <div className="flex items-center gap-4">
                  <div className="bg-[#F27141] bg-opacity-10 p-3 rounded-full">
                    <MdEmail className="text-[#F27141] text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email Us</h4>
                    <p className="text-gray-600">{restaurantData.email}</p>
                  </div>
                </div>
              )}

              {restaurantData?.phone && (
                <div className="flex items-center gap-4">
                  <div className="bg-[#F27141] bg-opacity-10 p-3 rounded-full">
                    <FaPhone className="text-[#F27141] text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Call Us</h4>
                    <p className="text-gray-600">{restaurantData.phone}</p>
                  </div>
                </div>
              )}

              {restaurantData?.address && (
                <div className="flex items-center gap-4">
                  <div className="bg-[#F27141] bg-opacity-10 p-3 rounded-full">
                    <FaLocationDot className="text-[#F27141] text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Visit Us</h4>
                    <p className="text-gray-600">{restaurantData.address}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gray-100 rounded-lg overflow-hidden h-[400px] relative z-10"
          >
            {hasValidCoords ? (
              <MapContainer
                center={[lat, long]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                className="rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[lat, long]}>
                  <Popup>
                    {restaurantData?.name || "Restaurant"}
                    <br />
                    {restaurantData?.address || "Location"}
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Map unavailable: Location coordinates not provided
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Main RestaurantPage component
export default function RestaurantPage() {
  const { restaurant: restaurantId } = useParams();
  const [activeSection, setActiveSection] = useState("");
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const sections = ["about", "menu", "reviews", "contact"];
  const sectionRefs = useRef({});

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const restaurantDoc = await getDoc(
          doc(db, "restaurants", restaurantId)
        );
        if (restaurantDoc.exists()) {
          setRestaurantData({
            id: restaurantDoc.id,
            ...restaurantDoc.data(),
          });
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchRestaurantData();
    }
  }, [restaurantId]);

  useEffect(() => {
    const options = {
      threshold: [0.2, 0.3, 0.4, 0.5],
      rootMargin: "-100px 0px -100px 0px",
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        observer.observe(element);
        sectionRefs.current[section] = element;
      }
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [sections]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F27141]"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Revo |{" "}
          {restaurantData?.name?.slice(0, 1).toUpperCase() +
            restaurantData?.name?.slice(1) || "Restaurant"}
        </title>
      </Helmet>
      <div className="bg-white">
        <RestaurantNavbar
          activeSection={activeSection}
          restaurantData={restaurantData}
        />
        <HeroSection restaurantData={restaurantData} />
        <AboutRestaurantSection restaurantData={restaurantData} />
        <MenuSection restaurantId={restaurantId} />
        <ReviewsSection restaurantId={restaurantId} />
        <ContactSection
          restaurantData={restaurantData}
          locationOnMap={{ lat: 30, long: 40 }}
        />
        <Cart />
      </div>
    </>
  );
}
