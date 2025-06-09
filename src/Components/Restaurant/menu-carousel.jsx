/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 -right-16 -translate-y-1/2 z-10 group"
  >
    <div className="relative">
      <div className="h-[2px] w-10 bg-[#f7e1d4] absolute top-1/2 right-full" />
      <div className="w-12 h-12 rounded-full bg-[#f7e1d4] flex items-center justify-center">
        <ChevronRight className="w-6 h-6 text-[#de9f71]" />
      </div>
    </div>
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 -left-16 -translate-y-1/2 z-10 group"
  >
    <div className="relative">
      <div className="h-[2px] w-10 bg-[#f7e1d4] absolute top-1/2 left-full" />
      <div className="w-12 h-12 rounded-full bg-[#f7e1d4] flex items-center justify-center">
        <ChevronLeft className="w-6 h-6 text-[#de9f71]" />
      </div>
    </div>
  </button>
);

export default function MenuCarousel({ restaurantId, onCategorySelect }) {
  const sliderRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const menuRef = collection(db, "restaurants", restaurantId, "menu");
        const menuSnapshot = await getDocs(menuRef);

        const categoryMap = new Map();
        menuSnapshot.forEach((doc) => {
          const data = doc.data();
          const key = data.category?.toLowerCase().trim();
          if (key && !categoryMap.has(key)) {
            categoryMap.set(key, {
              id: doc.id,
              category: key,
              image: data.image,
            });
          }
        });

        setCategories(Array.from(categoryMap.values()));
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) fetchCategories();
  }, [restaurantId]);

  const handleSlideClick = (index, category) => {
    setActiveIndex(index);
    sliderRef.current?.slickGoTo(index);
    onCategorySelect?.(category);
  };

  const settings = {
    centerMode: true,
    infinite: true,
    centerPadding: "0px",
    slidesToShow: Math.min(categories.length, 3),
    slidesToScroll: 1,
    speed: 500,
    focusOnSelect: true,
    beforeChange: (_, next) => setActiveIndex(next),
    nextArrow: categories.length > 1 ? <NextArrow /> : null,
    prevArrow: categories.length > 1 ? <PrevArrow /> : null,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (!categories.length)
    return (
      <div className="text-center py-10 text-gray-500">No categories found.</div>
    );

  return (
    <div className="relative w-[90%] max-w-5xl mx-auto py-12 px-4">
      <Slider ref={sliderRef} {...settings}>
        {categories.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={item.id}
              className="px-4 cursor-pointer"
              onClick={() => handleSlideClick(i, item.category)}
            >
              <div className="flex flex-col items-center transition-all duration-300">
                <div
                  className={`rounded-full overflow-hidden border-4 ${
                    isActive ? "w-48 h-48 border-[#F27141]" : "w-36 h-36 border-gray-200"
                  } bg-gray-100`}
                >
                  <img
                    src={item.image || "/assets/placeholder-dish.png"}
                    alt={item.category}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className={`mt-3 text-center text-lg capitalize ${
                    isActive ? "font-bold text-[#F27141]" : "text-gray-700"
                  }`}
                >
                  {item.category}
                </p>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
