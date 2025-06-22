/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthProvider";
import SectionHeading from "./section-heading";
import { getImageSrc } from "../../utils";

const ReviewsSection = ({ restaurantId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(
          db,
          "restaurants",
          restaurantId,
          "comments"
        );
        const q = query(reviewsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const reviewsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Collect unique userIds
        const userIds = [
          ...new Set(reviewsData.map((r) => r.userId).filter(Boolean)),
        ];

        // Fetch user data
        const userMap = {};
        for (const uid of userIds) {
          const userDoc = await getDoc(doc(db, "users", uid));
          if (userDoc.exists()) {
            userMap[uid] = userDoc.data();
          }
        }

        // Merge user name & image into reviews
        const mergedReviews = reviewsData.map((r) => ({
          ...r,
          userName: userMap[r.userId]?.name || "Anonymous",
          userImage: userMap[r.userId]?.image,
        }));

        setReviews(mergedReviews);
      } catch (err) {
        console.error("Error loading reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchReviews();
    }
  }, [restaurantId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!newReview.trim()) {
      toast.error("Please write your review");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        "https://comment-rating-final-production.up.railway.app/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ review: newReview.trim() }),
        }
      );
      const result = await response.json();
      
      const isPositive = result.predicted_rating === 1;

      const reviewData = {
        userId: currentUser.uid,
        comment: newReview.trim(),
        commentresult: isPositive,
        rating,
        createdAt: serverTimestamp(),
        userRef: doc(db, "users", currentUser.uid),
      };

      const reviewsRef = collection(
        db,
        "restaurants",
        restaurantId,
        "comments"
      );
      const docRef = await addDoc(reviewsRef, reviewData);

      // get user data
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      const userName = userData.name || "Anonymous";
      const userImage = userData.image;

      
      

      setReviews((prev) => [
        {
          id: docRef.id,
          ...reviewData,
          createdAt: new Date(),
          userName,
          userImage,
        },
        ...prev,
      ]);

      setNewReview("");
      setRating(5);
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F27141]"></div>
      </div>
    );
  }

  return (
    <section id="reviews" className="min-h-screen py-16 bg-white">
      <div className="container xl:max-w-[700px] mx-auto px-4">
        <SectionHeading title="Customer Reviews" />

        {/* Review Form */}
        <div className="mb-10 border border-gray-200 p-4 rounded-lg">
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27141]"
                rows="3"
                placeholder="Write your review here..."
                disabled={submitting}
              ></textarea>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-xl ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-1.5 text-sm rounded bg-[#F27141] text-white font-medium ${
                  submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e05f35]"
                }`}
              >
                {submitting ? "Submitting..." : "Post"}
              </button>
            </div>
          </form>
        </div>

        {/* Reviews List */}
        <div className="space-y-6 max-h-screen overflow-y-auto">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500">No reviews yet.</p>
          ) : (
            reviews.slice(0, visibleCount).map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={getImageSrc(review.userImage, "/assets/images/default-user.png")}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-800 text-sm">
                      {review.userName}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="text-yellow-400">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                      <span>
                        {new Date(
                          review.createdAt?.toDate?.() || new Date()
                        ).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Show More */}
        {visibleCount < reviews.length && (
          <div className="text-center mt-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="text-sm text-[#F27141] hover:underline font-medium"
            >
              Show more reviews
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
