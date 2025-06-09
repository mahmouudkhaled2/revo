/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import AboutRestaurantSection from "../Components/Restaurant/about-restuarant";
import SectionHeading from "../Components/Restaurant/section-heading";
import MenuSection from "./RestaurantMenu";
import Post from "../Components/Post";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";

// Replace the NavItem component with this improved version that has smooth transitions
const NavItem = ({ label, href, active = false }) => {
  const handleClick = (e) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`text-white hover:opacity-80 transition-opacity py-2 text-sm md:text-base relative
        after:absolute after:content-[''] after:w-full after:h-1.5 after:bg-white after:bottom-0 after:left-0 after:z-20 
        after:transition-all after:duration-300 after:ease-in-out
        ${active ? "after:opacity-100" : "after:opacity-0"}`}
    >
      {label}
    </a>
  );
};

const RestaurantNavbar = ({ activeSection }) => {
  const [showMenu, setShowMenu] = useState(false);

  const { restaurant } = useParams();

  const navItems = [
    { label: "About Us", href: "#about", id: "about" },
    { label: "Menu", href: "#menu", id: "menu" },
    { label: "Reviews", href: "#reviews", id: "reviews" },
    { label: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <header className="fixed top-[100px] left-0 right-0 z-20 bg-black bg-opacity-70">
      <nav className="container xl:max-w-[80%] mx-auto py-4 px-4 flex items-center justify-between gap-20">
        <div className="flex items-center gap-3">
          <img
            src="/assets/hagoga-logo.png"
            alt="Hagogah Logo"
            className="size-14 rounded-full object-cover"
          />
          <span className="text-white text-xl font-medium font-Inter">
            {restaurant}
          </span>
        </div>

        <div
          className={`absolute md:static top-[85px] start-0 end-0 w-full flex-1 items-center justify-between md:flex md:w-auto md:order-1 transition-all overflow-hidden ${
            showMenu ? "h-[300px]" : "h-[0px]"
          } md:h-auto`}
        >
          <div className="flex flex-col flex-1 items-center md:justify-between gap-5 xl:gap-10 bg-black bg-opacity-75 h-full md:bg-transparent p-4 md:p-0 font-bold rounded-b-lg md:space-x-6 rtl:space-x-reverse md:flex-row md:mt-0">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                label={item.label}
                href={item.href}
                active={activeSection === item.id}
              />
            ))}
          </div>
        </div>

        <button
          id="menuToggler"
          className="text-white text-3xl cursor-pointer m-0 md:hidden"
          onClick={() => setShowMenu(!showMenu)}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </nav>
    </header>
  );
};

const HeroSection = () => {
  const { restaurant } = useParams();
  return (
    <div className="relative h-[400px] md:h-[480px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/assets/hero-bg.jpg"
          alt="Hagogah Restaurant"
          className="w-full h-full object-cover"
        />
        {/* Overlay for better text visibility */}
        <div className="absolute z-10 inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold font-Inria mb-8">
          {restaurant || "Hagogah"}
        </h1>

        {/* Slider Dots */}
        <div className="flex items-center gap-7 mb-10">
          <span
            className={`relative block size-5 rounded-full transition-all border-2 border-white before:content-[''] before:absolute before:h-[2px] before:w-[100px] before:bg-white before:right-full before:top-1/2 before:translate-y-[-50%] before:z-50`}
          />
          <span
            className={`relative block size-5 rounded-full transition-all border-2 border-white before:content-[''] before:absolute before:h-[2px] before:w-[100px] before:bg-white before:left-full before:top-1/2 before:translate-y-[-50%] before:z-50`}
          />
        </div>

        <div className="max-w-2xl text-center">
          <p className="text-lg md:text-xl font-Inria">
            Enjoy homemade and rural cuisine in the atmosphere of Ramadan.
          </p>
        </div>
      </div>
    </div>
  );
};

const ReviewsSection = () => {
  return (
    <section id="reviews" className="min-h-screen flex items-center justify-center py-10 relative">
      <div className="text-center">
        <SectionHeading title={"Reviews"}/>
        <div className="container 2xl:max-w-[80%] mx-auto ps-20">
          <Post />
        </div>

        <button className="w-fit mx-auto border-none outline-none bg-transparent text-zinc-800 font-semibold underline mt-10">
          See more...
        </button>
      </div>

      <img src="/public/assets/" alt="" />
    </section>
  );
};

const ContactSection = () => {
  return (
    <section id="contact" className="flex items-center justify-center pt-10 relative">
      <div className="text-center">
        <SectionHeading title={"Contacts and Location"} classes="mb-10"/>
        <div className="container xl:max-w-[80%] mx-auto">
          {/* Text */}
          <div className="flex gap-3 mb-10">
            <img
              src="/assets/hagoga-logo.png"
              alt="Hagogah Logo"
              className="size-14 rounded-full object-cover"
            />
            <p className="flex-1 text-centerr ">
              We are here to take you on an enjoyable and delicious journey
              through the world of authentic and innovative cuisine. At Hajouja
              Restaurant, we offer you a taste of home and the spirit of the
              countryside, with a touch of creativity and innovation in every
              dish.
            </p>
          </div>

          <div className="h-[50vh] pt-10">
            <div className="max-w-sm mx-auto flex flex-col gap-10">
              {/* Emails */}
              <div className="flex items-center gap-5">
                <MdEmail size={25} className="text-[#f27141]" />
                <div>
                  <p>admin@Hagoga.com</p>
                  <p>support@Hagoga.com</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-5">
                <FaLocationDot size={25} className="text-[#f27141]" />
                <p>
                  حديقة المدفعية، شارع الصاعقة، دخلة شيراتون من طريق السويس،
                  امام موقف ٤ ونص مساكن
                </p>
              </div>
            </div>
             
          </div>
        </div>
      </div>
      <img src="/assets/footer-hagoga-bg.png" alt="" className="absolute w-[400px] bottom-0 left-0" />
    </section>
  );
};

export default function RestaurantPage() {
  const [activeSection, setActiveSection] = useState("");
  const sections = ["about", "menu", "reviews", "contact"];
  const sectionRefs = useRef({});

  // Initialize section refs on component mount
  useEffect(() => {
    // Set initial active section after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      checkVisibleSections();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // In the RestaurantPage component, replace the intersection observer useEffect with:
  useEffect(() => {
    // Use a more sophisticated approach with a debounce mechanism
    let debounceTimer = null;
    const debounceDelay = 50; // milliseconds

    const options = {
      threshold: [0.2, 0.3, 0.4, 0.5], // Multiple thresholds for smoother transitions
      rootMargin: "-100px 0px -100px 0px", // Adjust for navbar and hero section
    };

    const callback = (entries) => {
      // Clear any existing timer
      if (debounceTimer) clearTimeout(debounceTimer);

      // Get all entries that are intersecting
      const intersectingEntries = entries.filter(
        (entry) => entry.isIntersecting
      );

      // If we have intersecting entries, set a timer to update the active section
      if (intersectingEntries.length > 0) {
        // Sort by intersection ratio (highest first)
        intersectingEntries.sort(
          (a, b) => b.intersectionRatio - a.intersectionRatio
        );

        // Use the entry with the highest intersection ratio
        const topEntry = intersectingEntries[0];

        debounceTimer = setTimeout(() => {
          setActiveSection(topEntry.target.id);
        }, debounceDelay);
      }
    };

    const observer = new IntersectionObserver(callback, options);

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        observer.observe(element);
        sectionRefs.current[section] = element;
      }
    });

    return () => {
      // Cleanup observer
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          observer.unobserve(element);
        }
      });
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [sections]);

  // Replace the checkVisibleSections function with this improved version
  const checkVisibleSections = () => {
    let maxVisibility = 0;
    let mostVisibleSection = "";

    // Find the section that's most visible
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        const sectionTop = offsetTop;
        const sectionBottom = offsetTop + offsetHeight;

        // Calculate how much of the section is visible
        const visibleTop = Math.max(sectionTop, window.scrollY);
        const visibleBottom = Math.min(
          sectionBottom,
          window.scrollY + window.innerHeight
        );
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibilityPercentage = visibleHeight / offsetHeight;

        if (visibilityPercentage > maxVisibility) {
          maxVisibility = visibilityPercentage;
          mostVisibleSection = section;
        }
      }
    }

    // Only update if we found a visible section
    if (mostVisibleSection) {
      setActiveSection(mostVisibleSection);
    } else if (!activeSection && sections.length > 0) {
      // Default to first section if none are visible
      setActiveSection(sections[0]);
    }
  };

  // Replace the scroll event handler useEffect with this improved version
  useEffect(() => {
    let scrollTimer = null;
    const scrollDelay = 100; // milliseconds

    const handleScroll = () => {
      // Clear previous timer
      if (scrollTimer) clearTimeout(scrollTimer);

      // Set a new timer
      scrollTimer = setTimeout(() => {
        checkVisibleSections();
      }, scrollDelay);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <>
      <RestaurantNavbar activeSection={activeSection} />
      <HeroSection />
      <AboutRestaurantSection />
      <MenuSection />
      <ReviewsSection />
      <ContactSection />
    </>
  );
}
