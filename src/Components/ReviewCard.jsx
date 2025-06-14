import PropTypes from "prop-types";

export default function ReviewCard({ reviewText, rating, customerName, avatarSrc }) {
  // Render stars based on rating (1–5)
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <li key={i}>
          <i
            className={`fa-solid fa-star ${i < rating ? "text-[#EE9F00]" : "text-gray-300"}`}
          ></i>
        </li>
      );
    }
    return stars;
  };

  return (
    <div className="border-2 border-[#111111] p-4 shadow-md bg-white">
      <div className="flex items-center mb-5">
        <ul className="flex items-center gap-1">{renderStars()}</ul>
      </div>

      <p className="text-[#111111CC] font-normal mb-14 font-DM">{reviewText}</p>

      <div className="flex items-center gap-3">
        <img
          src={avatarSrc}
          alt={`${customerName}'s Avatar`}
          className="w-11 h-11 rounded-full"
        />
        <div>
          <h4 className="text-[#111111] font-semibold font-Grotesk">{customerName}</h4>
          <p className="text-gray-400 text-sm font-Inter">customer</p>
        </div>
      </div>
    </div>
  );
}

ReviewCard.propTypes = {
  reviewText: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  customerName: PropTypes.string.isRequired,
  avatarSrc: PropTypes.string.isRequired,
};