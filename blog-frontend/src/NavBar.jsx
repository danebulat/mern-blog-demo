import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

const NavBar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/articles">Articles</Link>
        </li>
      </ul>
      <div className="nav-right">
        {currentUser
          ? <button onClick={() => logout()}>Log Out</button>
          : <button onClick={() => { navigate('/login')}}>Log In</button>}
      </div>
    </nav>
  );
}

export default NavBar;
