import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AddCommentForm = ({ articleName, onArticleUpdated }) => {
  const [commentText, setCommentText] = useState('');
  const { currentUser } = useAuth(); 

  const addComment = async () => {
    const token = currentUser && await currentUser.getIdToken();
    const headers = token ? { authtoken: token } : {};
    const response = await axios.post(`http://localhost:8000/api/articles/${articleName}/comments`, {
      postedBy: currentUser.email,
      text: commentText,
    }, {
      headers,
    });
    const updatedArticle = response.data;
    onArticleUpdated(updatedArticle);
    setCommentText('');
  }

  return (
    <div id="add-comment-form">
      <h3>Add a Comment</h3>
      {currentUser && <p>You are posting as {currentUser.email}</p>}
      <textarea
        value={commentText}
        onChange={e => setCommentText(e.target.value)}
        rows="4"
        cols="50" />
      <button onClick={addComment}>Add Comment</button>
    </div>
  );
}

export default AddCommentForm;
