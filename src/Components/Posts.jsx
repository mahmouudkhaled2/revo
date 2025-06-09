/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import Post from './Post';
import StickerText from './StickerText';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function Posts({ userType, userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const POSTS_PER_PAGE = 5;
  const HOME_PAGE_LIMIT = 3;

  const fetchPosts = async (lastDoc = null) => {
    try {
      let postsQuery;
      
      if (isHomePage) {
        // For home page, just get first 3 posts
        postsQuery = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          limit(HOME_PAGE_LIMIT)
        );
      } else {
        // For posts page, handle pagination and user type
        let baseQuery = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc")
        );

        // If user is owner, only show their posts
        if (userType === 'owner' && userId) {
          baseQuery = query(
            collection(db, "posts"),
            orderBy("createdAt", "desc"),
            where("userId", "==", userId)
          );
        }

        if (lastDoc) {
          postsQuery = query(baseQuery, startAfter(lastDoc), limit(POSTS_PER_PAGE));
        } else {
          postsQuery = query(baseQuery, limit(POSTS_PER_PAGE));
        }
      }

      const postsSnapshot = await getDocs(postsQuery);
      
      // Set last visible document for pagination
      if (!isHomePage) {
        const lastVisible = postsSnapshot.docs[postsSnapshot.docs.length - 1];
        setLastVisible(lastVisible);
        setHasMore(postsSnapshot.docs.length === POSTS_PER_PAGE);
      }

      // Get comments for each post
      const postsWithComments = await Promise.all(
        postsSnapshot.docs.map(async (postDoc) => {
          const postData = postDoc.data();
          const postId = postDoc.id;

          const commentsSnapshot = await getDocs(
            collection(db, `posts/${postId}/comments`)
          );

          const comments = commentsSnapshot.docs.map(commentDoc => ({
            id: commentDoc.id,
            ...commentDoc.data()
          }));

          return {
            id: postId,
            ...postData,
            comments
          };
        })
      );

      if (lastDoc) {
        setPosts(prev => [...prev, ...postsWithComments]);
      } else {
        setPosts(postsWithComments);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [isHomePage, userType, userId]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await fetchPosts(lastVisible);
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    
    if (isHomePage) return; // Don't set up observer on home page

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, lastVisible]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F27141]"></div>
      </div>
    );
  }

  return (
    <>
      <section className="posts-section relative pt-14">
        <div className="container mx-auto xl:max-w-[80%] px-5">
          <StickerText />
          <div>
            {posts.length > 0 ? (
              <>
                {posts?.map((post) => (
                  <Post key={post.id} post={post} />
                ))}
                {!isHomePage && hasMore && (
                  <div 
                    id="scroll-sentinel" 
                    className="flex justify-center p-4"
                  >
                    {loadingMore && (
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F27141]"></div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-gray-500 text-lg">
                {userType === 'owner' ? 'You haven\'t created any posts yet' : 'No posts found'}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

Posts.propTypes = {
  userType: PropTypes.string,
  userId: PropTypes.string
};
