import { useState } from "react";
import axios from 'axios';
import { useAuth } from "../contexts/AuthContext";

const AddUpvote = ({ articleId, articleInfo, onArticleUpdated }) => {
  const { currentUser } = useAuth();

  const addUpvote = async () => {
    const token    = currentUser && await currentUser.getIdToken();
    const headers  = token ? { authtoken: token } : {};
    const response = await axios.put(`http://localhost:8000/api/articles/${articleId}/upvote`, 
      { headers });
    const updatedArticle = response.data;
    onArticleUpdated(updatedArticle);
  }

  return (
    <>
    <div className="upvotes-section">
      { currentUser 
          ? <button onClick={addUpvote}>{articleInfo.canUpvote ? 'Upvote' : 'Already Upvoted'}</button>
          : <button>Login to upvote</button>}
      <p>This article has { articleInfo.upvotes } upvote(s)</p>
    </div>
    </>
  );
}

export default AddUpvote;
