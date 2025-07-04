/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { formatDistanceToNow } from "date-fns";
import { FaRegComment, FaRegHeart, FaHeart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  Timestamp,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { authContext } from "../Context/AuthProvider";
import LoginModal from "./LoginModal";
import { getImageSrc } from "./../utils/index";
import { useNavigate } from "react-router-dom";

export default function Post({ post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [localLikes, setLocalLikes] = useState(post?.likes || 0);
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState(post?.comments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [userImage, setUserImage] = useState("");

  // Navigation
  const navigate = useNavigate();
  const { currentUser } = useContext(authContext);

  const id = post?.id;
  const restaurantId = post?.restaurantId;
  const restaurantName = restaurantData?.name;
  const description = post?.description;
  const image = `data:image/jpeg;base64,${post?.image}`;
  const restaurantImage = `data:image/jpeg;base64,${restaurantData?.logoUrl}`;
  const createdAt = post?.createdAt;

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
      }
    };

    if (restaurantId) {
      fetchRestaurantData();
    }
  }, [restaurantId]);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!currentUser) {
        setIsLiked(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userDoc.data();
        setUserImage(userData?.image);
        setIsLiked(userData?.likedPosts?.includes(id) || false);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkIfLiked();
  }, [currentUser, id]);

  const handleAuthRequired = (action) => {
    if (!currentUser) {
      setPendingAction(action);
      setShowLoginModal(true);
      return true;
    }
    return false;
  };

  const handleLike = async () => {
    if (handleAuthRequired("like")) return;

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const postRef = doc(db, "posts", id);

      const newLikeStatus = !isLiked;
      const newLikesCount = newLikeStatus ? localLikes + 1 : localLikes - 1;

      setIsLiked(newLikeStatus);
      setLocalLikes(newLikesCount);

      await updateDoc(postRef, {
        likes: newLikesCount,
      });

      await updateDoc(userRef, {
        likedPosts: newLikeStatus ? arrayUnion(id) : arrayRemove(id),
      });
    } catch (error) {
      console.error("Error updating like status:", error);
      setIsLiked(!isLiked);
      setLocalLikes(isLiked ? localLikes + 1 : localLikes - 1);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (handleAuthRequired("comment")) return;
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      let userName = currentUser.displayName || "User";
      if (currentUser?.uid) {
        const userDoc = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          userName = userData.name || userName;
          setUserImage(userData?.image);
        }
      }

      const commentData = {
        userName,
        userId: currentUser.uid,
        image: userImage,
        text: newComment.trim(),
        createdAt: Timestamp.now(),
      };

      const commentsRef = collection(db, "posts", id, "comments");
      const docRef = await addDoc(commentsRef, commentData);

      const commentWithId = {
        ...commentData,
        id: docRef.id,
      };

      setLocalComments((prevComments) => [...prevComments, commentWithId]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSuccess = () => {
    if (pendingAction === "like") {
      handleLike();
    } else if (pendingAction === "comment") {
      setShowComments(true);
    }
    setPendingAction(null);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      const commentRef = doc(db, "posts", id, "comments", commentId);
      await deleteDoc(commentRef);
      setLocalComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const timeAgo = createdAt?.toDate
    ? formatDistanceToNow(createdAt.toDate(), { addSuffix: true })
    : "recently";

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden my-8">
        <div className="p-4 flex items-center gap-4 border-b">
          <img
            src={restaurantImage}
            alt={restaurantName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <button type="button" onClick={() => navigate(`/for-restaurants/${restaurantId}`)} className="text-lg border-none outline-none font-semibold text-gray-900 hover:underline">
              {restaurantName}
            </button>
            <p className="text-sm text-gray-500">{timeAgo}</p>
          </div>
        </div>

        <div className="relative aspect-video">
          <img src={image} alt="Post" className="w-full h-full object-cover" />
        </div>

        <div className="p-4">
          <p className="text-gray-800 text-lg mb-4">{description}</p>

          <div className="flex items-center gap-6">
            <button
              onClick={currentUser ? handleLike : () => setShowLoginModal(true)}
              className="flex items-center gap-2 text-lg transition-colors"
            >
              {isLiked ? (
                <FaHeart className="text-[#F27141] text-2xl" />
              ) : (
                <FaRegHeart className="text-gray-600 hover:text-[#F27141] text-2xl" />
              )}
              <span className="text-gray-700">{localLikes}</span>
            </button>

            <button
              onClick={
                currentUser
                  ? () => setShowComments(true)
                  : () => setShowLoginModal(true)
              }
              className="flex items-center gap-2 text-lg text-gray-600 hover:text-gray-800"
            >
              <FaRegComment className="text-2xl" />
              <span>{localComments.length}</span>
            </button>
          </div>

          {localComments?.length > 0 && (
            <div className="mt-4 border-t pt-3">
              <div className="flex items-start gap-2">
                <img
                  src={getImageSrc(localComments[0]?.image, "/assets/images/default-user.png")}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm">
                    <span className="font-semibold">
                      {localComments[0]?.userName}
                    </span>{" "}
                    {localComments[0]?.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(localComments[0]?.createdAt?.toDate(), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              {localComments.length > 1 && (
                <button
                  onClick={
                    currentUser
                      ? () => setShowComments(true)
                      : () => setShowLoginModal(true)
                  }
                  className="text-gray-500 text-sm mt-2 hover:text-gray-700"
                >
                  View all {localComments.length} comments
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showComments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">Comments</h3>
              <button
                onClick={() => setShowComments(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 max-h-[60vh]">
              {localComments?.length > 0 ? (
                localComments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3 mb-4">
                    <img
                      src={getImageSrc(comment.image, "/assets/images/default-user.png")}
                      alt={comment.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          {comment.userName}
                        </span>
                        {currentUser?.uid === comment.userId && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>
                      <p className="text-sm mt-1">{comment.text}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>
                          {formatDistanceToNow(comment.createdAt?.toDate(), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>

            <div className="border-t p-4">
              {currentUser ? (
                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-[#F27141]"
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className={`${
                      isSubmitting || !newComment.trim()
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#F27141] hover:bg-[#e05f35]"
                    } text-white px-6 py-2 rounded-full transition-colors`}
                  >
                    {isSubmitting ? "Posting..." : "Post"}
                  </button>
                </form>
              ) : (
                <div className="text-center p-4">
                  <p className="text-gray-600 mb-3">
                    Want to join the conversation? Login to leave a comment!
                  </p>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-[#F27141] text-white px-6 py-2 rounded-full hover:bg-[#e05f35] transition-colors"
                  >
                    Log in now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}