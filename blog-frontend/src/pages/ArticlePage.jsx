import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NotFoundPage from './NotFoundPage';
import CommentsList from '../components/CommentsList';
import AddCommentForm from '../components/AddCommentForm';
import articles from './article-content';
import {useAuth} from '../contexts/AuthContext';

const ArticlePage = () => {
  const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [], canUpvote: false });
  const { canUpvote } = articleInfo;
  const { articleId } = useParams();

  const { currentUser } = useAuth();

  useEffect(() => {
    const loadArticleInfo = async () => {
      const token = currentUser && await currentUser.getIdToken();
      const headers = token ? { authtoken: token } : {};
      const response = await axios.get(`http://localhost:8000/api/articles/${articleId}`, { headers });
      const newArticleInfo = response.data;
      setArticleInfo(newArticleInfo);
    }

    loadArticleInfo();
  }, [currentUser]);

  const article = articles.find(article => article.name === articleId);

  const addUpvote = async () => {
    const token = currentUser && await currentUser.getIdToken();
    const headers = token ? { authtoken: token } : {};
    const response = await axios.put(`http://localhost:8000/api/articles/${articleId}/upvote`, null, { headers });
    const updatedArticle = response.data;
    setArticleInfo(updatedArticle);
  }

  if (!article) {
    return <NotFoundPage />
  }

  return (
    <>
    <h1>{article.title}</h1>
    <div className="upvotes-section">
      {currentUser
        ? <button onClick={addUpvote}>{canUpvote ? 'Upvote' : 'Already Upvoted'}</button>
        : <button>Log in to upvote</button>}
      <p>This article has {articleInfo.upvotes} upvote(s)</p>
    </div>
    {article.content.map((paragraph, i) => (
      <p key={i}>{paragraph}</p>
    ))}
    {currentUser
      ? <AddCommentForm
        articleName={articleId}
        onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)} />
      : <button>Log in to add a comment</button>}
    <CommentsList comments={articleInfo.comments} />
    </>
  );
}

export default ArticlePage;
