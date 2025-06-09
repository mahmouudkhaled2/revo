import { useContext, useEffect, useState } from 'react';
import Posts from '../Components/Posts';
import { authContext } from '../Context/AuthProvider';
import { collection, query, orderBy, getDocs, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase-config';
import { Toaster } from 'react-hot-toast';

export default function PostsPage() {
  const { currentUser } = useContext(authContext);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const POSTS_PER_PAGE = 5; // Increased to 5 posts per page

  const fetchPosts = async (lastDoc = null) => {
    try {
      let postsQuery;
      if (lastDoc) {
        postsQuery = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(POSTS_PER_PAGE)
        );
      } else {
        postsQuery = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          limit(POSTS_PER_PAGE)
        );
      }

      const querySnapshot = await getDocs(postsQuery);
      const fetchedPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Update last visible document
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastVisible);

      // Check if there are more posts to load
      setHasMore(querySnapshot.docs.length === POSTS_PER_PAGE);

      return fetchedPosts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  // Initial load
  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true);
      const initialPosts = await fetchPosts();
      setPosts(initialPosts);
      setLoading(false);
    };

    loadInitialPosts();
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        === document.documentElement.offsetHeight
      ) {
        if (hasMore && !loadingMore && lastVisible) {
          setLoadingMore(true);
          const morePosts = await fetchPosts(lastVisible);
          setPosts(prevPosts => [...prevPosts, ...morePosts]);
          setLoadingMore(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadingMore, lastVisible]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F27141]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#F27141',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Posts list */}
      <Posts 
        userId={currentUser?.uid} 
        posts={posts}
        setPosts={setPosts}
      />

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F27141]"></div>
        </div>
      )}

      {/* No more posts message */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center text-gray-500 py-4">
          No more posts to load
        </div>
      )}

      {/* No posts message */}
      {!loading && posts.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No posts available
        </div>
      )}
    </div>
  );
}
