import { useState } from 'react';
import '../css/Blog.css';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      setPosts([...posts, { text: newPost, date: new Date().toLocaleString() }]);
      setNewPost('');
    }
  };

  return (
    <div className="blog">
      <h2>Community Blog</h2>
      <form onSubmit={handleSubmit} className="post-form">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your fitness journey..."
        />
        <button type="submit">Post</button>
      </form>
      <div className="posts">
        {posts.map((post, index) => (
          <div key={index} className="post">
            <p>{post.text}</p>
            <small>{post.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;