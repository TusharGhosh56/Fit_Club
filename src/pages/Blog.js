import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { fetchPosts, createPost, deletePost, updatePost, saveReply } from '../services/blogService';
import defaultProfileImage from "../assets/profile/default_profile_image.jpg";
import '../css/Blog.css';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editText, setEditText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyPostId, setReplyPostId] = useState(null);
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

    if (newPost.trim() || newImage) {
      setIsLoading(true);
      setError('');

      try {
        const result = await createPost(newPost.trim(), newImage);
        if (result.success) {
          setPosts(prevPosts => [result.data, ...prevPosts]);
          setNewPost('');
          setNewImage(null);
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

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setIsLoading(true);
      setError('');

      try {
        const result = await deletePost(postId);
        if (result.success) {
          setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        } else {
          setError(result.error);
        }
      } catch (error) {
        setError('Failed to delete post');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post.id);
    setEditText(post.text);
  };

  const handleUpdate = async (postId) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await updatePost(postId, editText.trim());
      if (result.success) {
        setPosts(prevPosts => prevPosts.map(post =>
          post.id === postId
            ? { ...post, text: editText.trim(), editedAt: new Date().toLocaleString() }
            : post
        ));
        setEditingPost(null);
        setEditText('');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditText('');
  };

  const handleProfileClick = (authorId) => {
    navigate(`/profile/${authorId}`);
  };

  const handleChatClick = (authorId) => {
    console.log(`Chat with user ID: ${authorId}`);
  };

  const handleReplyClick = (authorName, postId) => {
    setReplyText(`@${authorName} `);
    setReplyPostId(postId);
  };

  const handleReplySubmit = async () => {
    if (replyPostId) {
      const updatedPosts = posts.map(post => {
        if (post.id === replyPostId) {
          post.replies = post.replies || [];
          post.replies.push(replyText);
        }
        return post;
      });
      setPosts(updatedPosts);
      setReplyText('');
      setReplyPostId(null);

      const result = await saveReply(replyPostId, replyText);
      if (!result.success) {
        console.error('Error saving reply:', result.error);
      }
    }
  };

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h2>Community Blog</h2>
        {error && <div className="error-message">{error}</div>}
      </div>
      {isLoading && posts.length === 0 ? (
        <div className="loading">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="post-form">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder={auth.currentUser ? "Share your fitness journey..." : "Please login to post"}
            disabled={!auth.currentUser}
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            disabled={!auth.currentUser} 
          />
          <button 
            onClick={() => !auth.currentUser && navigate('/login')}
            disabled={isLoading}
          >
            {!auth.currentUser ? "Login to Post" : isLoading ? "Posting..." : "Post"}
          </button>
        </form>
      )}
      <div className="posts-container">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="author-info">
                <div className="author-photo-container">
                  <img
                    src={post.authorPhoto || defaultProfileImage}
                    alt={post.authorName}
                    className="author-photo"
                    onError={(e) => {
                      e.target.src = defaultProfileImage;
                    }}
                    onClick={() => handleProfileClick(post.authorId)}
                  />
                  <div className="dropdown">
                    <button className="dropbtn"></button>
                    <div className="dropdown-content">
                      <button onClick={() => handleProfileClick(post.authorId)}>Profile</button>
                      <button onClick={() => handleChatClick(post.authorId)}>Chat</button>
                    </div>
                  </div>
                </div>
                <div className="author-details">
                  <span className="author-name">{post.authorName}</span>
                  <span className="post-date">{post.createdAt}</span>
                </div>
              </div>
              <span className="post-date">
                {post.editedAt ? `Edited: ${post.editedAt}` : post.createdAt}
              </span>
            </div>

            {post.replies && post.replies.length > 0 && (
              <div className="replies-container">
                {post.replies.map((reply, index) => (
                  <div key={index} className="reply">
                    <strong>{reply}</strong>
                  </div>
                ))}
              </div>
            )}

            {editingPost === post.id ? (
              <div className="edit-post-form">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="edit-textarea"
                />
                <div className="edit-actions">
                  <button
                    onClick={() => handleUpdate(post.id)}
                    disabled={isLoading}
                    className="save-btn"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="post-content">{post.text}</p>
                {post.image && <img src={post.image} alt="Post" className="post-image" />}
              </div>
            )}

            <div className="post-actions">
              <div className="action-buttons">
                <button
                  className="action-button"
                  disabled={!auth.currentUser}
                >
                </button>
                <button
                  className="action-button"
                  onClick={() => handleReplyClick(post.authorName, post.id)}
                >
                  <i className="far fa-share-square"></i>
                </button>
              </div>

              {auth.currentUser?.uid === post.authorId && (
                <div className="post-owner-actions">
                  <button
                    onClick={() => handleEdit(post)}
                    className="edit-button"
                    disabled={isLoading}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="delete-button"
                    disabled={isLoading}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              )}
            </div>

            {replyPostId === post.id && (
              <div className="reply-input">
                <input 
                  type="text" 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleReplySubmit();
                    }
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;