/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import SectionHeading from './section-heading';

export default function AboutRestaurantSection({ restaurantData }) {

  const features = restaurantData?.features || [
    'Fresh, locally-sourced ingredients',
    'Traditional cooking methods',
    'Warm, welcoming atmosphere'
  ];

  return (
    <section id="about" className="min-h-screen py-16 bg-white">
      <div className="container xl:max-w-[80%] mx-auto px-4">
        <SectionHeading title="About Us" />
        
        <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
          {/* Left side - Images */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <img
                src={restaurantData?.images?.[0] || restaurantData?.image || "/assets/placeholder-restaurant.jpg"}
                alt="Restaurant Interior"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <img
                src={restaurantData?.images?.[1] || restaurantData?.image || "/assets/placeholder-restaurant.jpg"}
                alt="Signature Dish"
                className="w-full h-64 object-cover rounded-lg shadow-lg mt-8"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-[#F27141] text-white p-6 rounded-lg shadow-xl">
              <p className="text-2xl font-bold">{restaurantData?.experienceYears || '0'}+</p>
              <p className="text-sm">Years of Excellence</p>
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-gray-900">
              {restaurantData?.name || "Experience the Taste of Tradition"}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {restaurantData?.description || 
                "Welcome to our restaurant, where tradition meets innovation. We take pride in serving authentic dishes that have been perfected over generations, while adding our own unique modern twist to create unforgettable dining experiences."}
            </p>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-[#F27141] text-xl">✓</span>
                  <p className="text-gray-700">{feature}</p>
                </div>
              ))}
            </div>

            <button className="bg-[#F27141] text-white px-8 py-3 rounded-full hover:bg-[#e05f35] transition-colors mt-6">
              Learn More
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}