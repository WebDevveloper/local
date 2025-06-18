import { Link, useNavigate, useLocation } from 'react-router-dom';
import './css/NavBar.css'

export default function NavBar({ role }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  if (['/', '/login', '/registration'].includes(pathname)) return null;

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav>
      <Link to="/orders" >История</Link>
      <Link to="/create-orders" >Новая</Link>
      {role === 'admin' && (
        <Link to="/admin" >Админка</Link>
      )}
      <button onClick={logout} >Выход</button>
    </nav>
  );
}
