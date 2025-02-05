import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { collection, addDoc, query, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
import '../css/Blog.css';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toLocaleString() || new Date().toLocaleString()
        }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    if (newPost.trim()) {
      try {
        setIsLoading(true);
        const postData = {
          text: newPost,
          createdAt: serverTimestamp(),
          authorId: auth.currentUser.uid,
          authorName: auth.currentUser.displayName || 'Anonymous',
          authorEmail: auth.currentUser.email,
          authorPhoto: auth.currentUser.photoURL || null,
          likes: 0,
          comments: []
        };

        const docRef = await addDoc(collection(db, 'posts'), postData);


        setPosts(prevPosts => [{
          id: docRef.id,
          ...postData,
          createdAt: new Date().toLocaleString()
        }, ...prevPosts]);

        setNewPost('');
      } catch (error) {
        console.error("Error adding post:", error);
        alert('Failed to create post. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="blog">
        <h2>Community Blog</h2>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="blog">
      <h2>Community Blog</h2>
      <form onSubmit={handleSubmit} className="post-form">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder={auth.currentUser ? "Share your fitness journey..." : "Please login to post"}
          disabled={!auth.currentUser}
        />
        <button 
          type="submit" 
          disabled={!auth.currentUser || isLoading}
        >
          {!auth.currentUser ? "Login to Post" : isLoading ? "Posting..." : "Post"}
        </button>
      </form>
      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <div className="post-header">
              <div className="author-info">
                {post.authorPhoto ? (
                  <img 
                    src={post.authorPhoto} 
                    alt={post.authorName} 
                    className="author-photo"
                  />
                ) : (
                  <div className="author-photo">
                    <i className="fas fa-user"></i>
                  </div>
                )}
                <div className="author-details">
                  <span className="author-name">{post.authorName}</span>
                  <small className="author-email">{post.authorEmail}</small>
                </div>
              </div>
              <span className="post-date">{post.createdAt}</span>
            </div>
            <p className="post-content">{post.text}</p>
            <div className="post-actions">
              <div className="action-buttons">
                <button 
                  className="action-button"
                  disabled={!auth.currentUser}
                >
                  <i className="far fa-heart"></i>
                  <span>{post.likes}</span>
                </button>
                <button 
                  className="action-button"
                  disabled={!auth.currentUser}
                >
                  <i className="far fa-comment"></i>
                  <span>{post.comments?.length || 0}</span>
                </button>
                <button 
                  className="action-button"
                  disabled={!auth.currentUser}
                >
                  <i className="far fa-share-square"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;