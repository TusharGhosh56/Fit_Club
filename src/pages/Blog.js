import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { createPost, deletePost, updatePost, saveReply } from '../services/blogService';
import defaultProfileImage from "../assets/profile/default_profile_image.jpg";
import '../css/Blog.css';
import { motion } from "framer-motion";
import { 
  onSnapshot, 
  query, 
  collection, 
  orderBy, 
  doc, 
  getDoc, 
  getDocs, 
  where, 
} from 'firebase/firestore';

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
    // Set up real-time listener for posts
    const unsubscribe = onSnapshot(
      query(collection(db, 'posts'), orderBy('createdAt', 'desc')),
      async (snapshot) => {
        try {
          const fetchedPosts = await Promise.all(
            snapshot.docs.map(async (docSnapshot) => {
              const postData = docSnapshot.data();
              
              // Fetch author data
              const authorRef = doc(db, 'users', postData.authorId);
              const authorSnap = await getDoc(authorRef);
              const authorData = authorSnap.exists() ? authorSnap.data() : {};

              // Set up real-time listener for replies
              const repliesSnapshot = await getDocs(
                query(
                  collection(db, 'replies'),
                  where('postId', '==', docSnapshot.id),
                  orderBy('createdAt', 'desc')
                )
              );
              
              const replies = await Promise.all(
                repliesSnapshot.docs.map(async (replyDoc) => {
                  const replyData = replyDoc.data();
                  const replyUserRef = doc(db, 'users', replyData.userId);
                  const replyUserSnap = await getDoc(replyUserRef);
                  const replyUserData = replyUserSnap.exists() ? replyUserSnap.data() : {};

                  return {
                    id: replyDoc.id,
                    text: replyData.replyText,
                    createdAt: replyData.createdAt?.toDate?.().toLocaleString() || new Date().toLocaleString(),
                    userId: replyData.userId,
                    userName: replyData.userName || 'Anonymous',
                    userPhoto: replyUserData.photoURL || null
                  };
                })
              );

              return {
                id: docSnapshot.id,
                ...postData,
                authorPhoto: authorData.photoURL || null,
                authorRole: authorData.role || 'User',
                createdAt: postData.createdAt?.toDate?.().toLocaleString() || new Date().toLocaleString(),
                replies: replies
              };
            })
          );

          setPosts(fetchedPosts);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching posts:', error);
          setError('Failed to load posts');
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Posts subscription error:', error);
        setError('Failed to load posts');
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

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
      setError('');

      try {
        const result = await deletePost(postId);
        if (!result.success) {
          setError(result.error);
        }
      } catch (error) {
        setError('Failed to delete post');
      }
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post.id);
    setEditText(post.text);
  };

  const handleUpdate = async (postId) => {
    setError('');

    try {
      const result = await updatePost(postId, editText.trim());
      if (result.success) {
        setEditingPost(null);
        setEditText('');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to update post');
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
    navigate(`/chat/${authorId}`);
  };

  const handleReplyClick = (authorName, postId) => {
    setReplyText(`@${authorName} `);
    setReplyPostId(postId);
  };

  const handleReplySubmit = async () => {
    if (replyPostId && replyText.trim()) {
      const result = await saveReply(replyPostId, replyText.trim());
      if (!result.success) {
        setError(result.error || 'Failed to save reply');
      }
      setReplyText('');
      setReplyPostId(null);
    }
  };

  return (
    <div className="blog-container">
      <motion.div 
        className="blog-header"
        initial={{ opacity: 0, y: -20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <h2>Community </h2><div className='title-white'>Blog</div> 
        {error && <div className="error-message">{error}</div>}
      </motion.div>
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
          <motion.div 
            key={post.id} 
            className="post-card"
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <div className="post-header">
              <img 
                src={post.authorPhoto || defaultProfileImage} 
                alt={post.authorName} 
                className="profile-pic"
                onClick={() => handleProfileClick(post.authorId)}
              />
              <div className="post-info">
                <h3 onClick={() => handleProfileClick(post.authorId)}>{post.authorName}</h3>
                <p className="post-date">{post.createdAt}</p>
              </div>
              {auth.currentUser?.uid === post.authorId && (
                <div className="post-actions">
                  <button onClick={() => handleEdit(post)}>Edit</button>
                  <button onClick={() => handleDelete(post.id)}>Delete</button>
                </div>
              )}
            </div>

            {editingPost === post.id ? (
              <div className="edit-section">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div className="edit-buttons">
                  <button onClick={() => handleUpdate(post.id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <p className="post-text">{post.text}</p>
                {post.image && (
                  <img src={post.image} alt="Post content" className="post-image" />
                )}
              </>
            )}

            <div className="replies-section">
              {post.replies && post.replies.map((reply, index) => (
                <div key={reply.id || index} className="reply">
                  <img 
                    src={reply.userPhoto || defaultProfileImage} 
                    alt={reply.userName} 
                    className="reply-profile-pic"
                    onClick={() => handleProfileClick(reply.userId)}
                  />
                  <div className="reply-content">
                    <span className="reply-author" onClick={() => handleProfileClick(reply.userId)}>
                      {reply.userName}
                    </span>
                    <span className="reply-text">{reply.text}</span>
                    <span className="reply-date">{reply.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="post-footer">
              <button onClick={() => handleReplyClick(post.authorName, post.id)}>Reply</button>
              <button onClick={() => handleChatClick(post.authorId)}>Message</button>
            </div>

            {replyPostId === post.id && (
              <div className="reply-input-section">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                />
                <button onClick={handleReplySubmit}>Send Reply</button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Blog;