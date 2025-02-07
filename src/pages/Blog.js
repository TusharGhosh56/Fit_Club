import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { fetchPosts, createPost } from '../services/blogService';
import '../css/Blog.css';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const result = await fetchPosts();
      if (result.success) {
        setPosts(result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    if (newPost.trim()) {
      setIsLoading(true);
      setError('');

      try {
        const result = await createPost(newPost.trim());
        
        if (result.success) {
          setPosts(prevPosts => [result.data, ...prevPosts]);
          setNewPost('');
        } else {
          setError(result.error);
        }
      } catch (error) {
        setError('Failed to create post. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading && posts.length === 0) {
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
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="post-form">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder={auth.currentUser ? "Share your fitness journey..." : "Please login to post"}
          disabled={!auth.currentUser}
        />
        <button 
          onClick={() => !auth.currentUser && navigate('/login')}
          disabled={isLoading}
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