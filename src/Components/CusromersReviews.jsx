import ReviewCard from "./ReviewCard";

// Utility function to shuffle an array (for randomization)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function CustomersReviewsSection() {
  // Predefined data pools for variety
  const reviewTexts = [
    "The food was absolutely delicious, and the service was top-notch! I'll definitely come back.",
    "Great atmosphere and tasty dishes, but the wait time was a bit long.",
    "Loved the variety of the menu! Everything was fresh and flavorful.",
    "Good food, but the portion sizes could be larger for the price.",
    "Fantastic experience! The staff was friendly, and the desserts were amazing.",
    "Solid dining experience, though the music was a bit loud for my taste.",
    "Incredible flavors and quick service. Highly recommend!",
    "Nice place, but the seating was a bit cramped.",
  ];

  const customerNames = [
    "Leslie Alexander",
    "Michael Chen",
    "David Patel",
    "James Brown",
    "Jhonthan Khan",
    "Carlos Rivera",
  ];

  // Avatar images (relative paths)
  const avatarImages = [
    "/assets/images/customer-1.png",
    "/assets/images/customer-2.jpg",
    "/assets/images/customer-3.jpg",
    "/assets/images/customer-4.jpg",
    "/assets/images/customer-5.jpg",
    "/assets/images/customer-6.jpg",
  ];

  // Generate dynamic reviews
  const generateReviews = () => {
    const shuffledReviews = shuffleArray(reviewTexts).slice(0, 6);
    const shuffledNames = shuffleArray(customerNames).slice(0, 6);
    const ratings = [5, 4, 3, 5, 4, 5]; // Varied ratings (can randomize if needed)
    const reviews = [];

    for (let i = 0; i < 6; i++) {
      reviews.push({
        reviewText: shuffledReviews[i],
        rating: ratings[i],
        customerName: shuffledNames[i],
        avatarSrc: avatarImages[i],
      });
    }

    return reviews;
  };

  const reviews = generateReviews();

  return (
    <section className="bg-[#FFF1E8] py-14 px-4">
      <div className="container mx-auto xl:max-w-[80%]">
        <div className="flex flex-col lg:flex-row justify-between items-center text-center mb-14">
          <h2 className="text-[38px] font-bold underline font-Grotesk">
            ”Honest Reviews from Our Customers”
          </h2>
          <button className="mt-4 px-5 py-2 bg-lime-300 text-[15px] border-2 border-[#111111] text-black font-medium hover:bg-lime-400 font-Grotesk">
            Join For Free
          </button>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <ReviewCard
              key={index}
              reviewText={review.reviewText}
              rating={review.rating}
              customerName={review.customerName}
              avatarSrc={review.avatarSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}