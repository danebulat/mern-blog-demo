import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState();

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate('/articles');
    } catch (e) {
      setError(e.message);
    }

    // after waiting for login
    setLoading(false);
  }

  return (
    <>
    <h1>Log In</h1>
    {error && <p className="error">{error}</p>}
    <input
      type="email"
      ref={emailRef}
      placeholder="Your email address"
      required />
    <input
      type="password"
      placeholder="Your password"
      ref={passwordRef}
      required />
    <button disabled={loading} onClick={handleSubmit}>Log In</button>
    <Link to="/create-account">Don't have an account? Create one here</Link>
    </>
  );
}

export default LoginPage;
