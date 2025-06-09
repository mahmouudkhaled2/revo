/* eslint-disable react/prop-types */
import ReviewsIcon from '/assets/images/carbon_review.svg'
import CommentsIcon from '/assets/images/iconamoon_comment-light.svg'
import LikeIcon from '/assets/images/uiw_like-o.svg'
import { useState } from 'react'

export default function PostInteractions({ display, comments = [], likes = 0, rating = 0 }) {
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement comment submission
    console.log('Submitting comment:', commentText);
    setCommentText('');
  };

  return (
    <>
      <div className={`interaction-section order-4 w-full mt-6 ${display}`}>
        <div className="flex items-center gap-2 mb-10">
          <span className="text-sm font-normal text-[#77838F]">({rating})</span>
          <ul className="flex gap-1">
            {[...Array(5)].map((_, index) => (
              <li key={index}>
                <i className={`fa-solid fa-star text-lg md:text-2xl ${
                  index < Math.floor(rating) ? 'text-[#FFAE17]' : 'text-gray-300'
                }`}></i>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-10 mt-5">
          <img src={ReviewsIcon} alt="Reviews Icon" className='w-7' />
          <img src={CommentsIcon} alt="Comments Icon" className='w-7' />
          <img src={LikeIcon} alt="Like Icon" className='w-7' />
        </div>

        <div className="my-7 text-start">
          <p className="text-xl font-medium mb-2">{likes} likes</p>
          <p className="text-xl font-light">
            {comments.length > 0 && `View all ${comments.length} comments`}
          </p>
        </div>

        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder="Add a comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="add-comment-input w-full border-b border-black py-3 focus:outline-none text-xl font-light"
          />
        </form>
      </div>
    </>
  )
}
