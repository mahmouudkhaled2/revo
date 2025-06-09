/* eslint-disable react/prop-types */
"use client"

import { useRef, useState, useEffect } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase-config'

// Custom arrow components
const NextArrow = (props) => {
  const { onClick } = props
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -right-16 -translate-y-1/2 z-10 group"
      aria-label="Next slide"
    >
      <div className="relative">
        <div className="h-[2px] w-10 bg-[#f7e1d4] absolute top-1/2 right-full"></div>
        <div className="w-12 h-12 rounded-full bg-[#f7e1d4] flex items-center justify-center transition-colors group-hover:bg-[#f7e1d4]">
          <ChevronRight className="w-6 h-6 bg-[#f7e1d4] text-[#de9f71]" />
        </div>
      </div>
    </button>
  )
}

const PrevArrow = (props) => {
  const { onClick } = props
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -left-16 -translate-y-1/2 z-10 group"
      aria-label="Previous slide"
    >
      <div className="relative">
        <div className="h-[2px] w-10 bg-[#f7e1d4] absolute top-1/2 left-full"></div>
        <div className="w-12 h-12 rounded-full bg-[#f7e1d4] flex items-center justify-center transition-colors group-hover:bg-[#f7e1d4]">
          <ChevronLeft className="w-6 h-6 bg-[#f7e1d4] text-[#de9f71]" />
        </div>
      </div>
    </button>
  )
}

function MenuCarousel({ restaurantId, onCategorySelect }) {
  const sliderRef = useRef(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Get all menu items
        const menuRef = collection(db, 'restaurants', restaurantId, 'menu')
        const menuSnapshot = await getDocs(menuRef)
        
        // Group by category and get first item's image
        const categoryMap = new Map()
        
        menuSnapshot.docs.forEach(doc => {
          const item = doc.data()
          if (item.category) {
            if (!categoryMap.has(item.category)) {
              categoryMap.set(item.category, {
                id: doc.id,
                category: item.category,
                image: item.image // Use the first item's image as category image
              })
            }
          }
        })

        const uniqueCategories = Array.from(categoryMap.values())
        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Error fetching menu categories:", error)
      } finally {
        setLoading(false)
      }
    }

    if (restaurantId) {
      fetchCategories()
    }
  }, [restaurantId])

  const settings = {
    className: "center",
    centerMode: true,
    infinite: categories.length > 1, // Disable infinite scroll for single item
    centerPadding: "0px",
    slidesToShow: Math.min(categories.length, 3), // Show only available categories
    speed: 500,
    nextArrow: categories.length > 1 ? <NextArrow /> : null, // Hide arrows for single item
    prevArrow: categories.length > 1 ? <PrevArrow /> : null,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: categories.length > 1 ? 1 : 1,
          centerPadding: categories.length > 1 ? "50px" : "0px",
        },
      },
    ],
  }

  if (loading) {
    return (
      <div className="w-[80%] max-w-4xl mx-auto py-12 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F27141]"></div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="w-[80%] max-w-4xl mx-auto py-12 px-4 text-center text-gray-500">
        No menu categories available
      </div>
    )
  }

  return (
    <div className="slider-container w-[80%] max-w-4xl mx-auto py-12 px-4 relative">
      <Slider ref={sliderRef} {...settings}>
        {categories.map((item) => (
          <div 
            key={item.id} 
            className="px-4 cursor-pointer"
            onClick={() => onCategorySelect?.(item.category)}
          >
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200 mx-auto">
                <img 
                  src={item.image || "/assets/placeholder-dish.png"} 
                  alt={item.category} 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-3 text-center font-medium text-lg" style={{ fontFamily: "Arial, sans-serif" }}>
                {item.category} 
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default MenuCarousel