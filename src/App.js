import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar           from './components/NavBar';
import RequireAuth      from './components/RequireAuth';
import RequireAdmin     from './components/RequireAdmin';
import RegistrationForm from './pages/RegistrationForm';
import Authorization    from './pages/Authorization';
import Orders           from './pages/Orders';
import CreateOrder      from './pages/CreateOrder';
import AdminPanel       from './pages/AdminPanel';
import AdminStatus       from './pages/AdminStatus';
import Footer from './components/Footer';


function App() {
  const token = localStorage.getItem('token');
  let role = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload.role;
    } catch {}
  }

  return (
    <BrowserRouter>
      <NavBar role={role} />

      <Routes>
        {/* Публичные */}
        <Route index               element={<Authorization />} />
        <Route path="/login"       element={<Authorization />} />
        <Route path="/registration" element={<RegistrationForm />} />

        {/* Защищённые */}
        <Route element={<RequireAuth />}>
          <Route path="/orders"        element={<Orders />} />
          <Route path="/create-orders" element={<CreateOrder />} />

          {/* Админка */}
          <Route element={<RequireAdmin role={role} />}>
            <Route path="/admin" element={<AdminPanel />} />
            {/* <Route path="/admin" element={<AdminStatus />} /> */}
          </Route>
        </Route>

        {/* Все прочие */}
        <Route path="*" element={
          token
            ? <Navigate to="/orders" replace />
            : <Navigate to="/login" replace />
        } />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
