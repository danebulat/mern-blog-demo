import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CreateAccountPage = () => {
  const [loading, setLoading] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [error, setError] = useState('');
  const { signup } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (passwordRef.current.value !== confirmPasswordRef.current.value) {
        setError('Password and confirm password do not match');
        return;
      }
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate('/articles');
    } catch (e) {
      setError(e.message);
    }

    // after waiting for sign up
    setLoading(false);
  }

  return (
    <>
    <h1>Create Account</h1>
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
    <input
      type="password"
      placeholder="Re-enter your password"
      ref={confirmPasswordRef}
      required />
    <button disabled={loading} onClick={handleSubmit}>Create Account</button>
    <Link to="/login">Already have an account? Log in here</Link>
    </>
  );
}

export default CreateAccountPage;
