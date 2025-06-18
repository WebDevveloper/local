import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Authorization() {
  const navigate = useNavigate();

  useEffect(() => {
    // проверяем JWT в localStorage
    if (localStorage.getItem('token')) {
      navigate('/orders', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login: document.getElementById('login').value,
        pass: document.getElementById('pass').value
      })
    });
    const data = await res.json();

    if (res.ok) {
      // сохраним только токен, а не весь объект
      localStorage.setItem('token', data.accessToken);
      // перезагрузка страницы, чтобы App.js пересчитал role и маршрут сразу отобразил панель админа
      window.location.href = '/orders';
    } else {
      alert(data.message || 'Ошибка авторизации');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>Логин</label>
        <input type='text' id='login' required />

        <label>Пароль</label>
        <input type='password' id='pass' required />

        <button type="submit">Войти</button>

        <p>Нет аккаунта? <Link to='/registration'>Зарегистрироваться</Link></p>
      </form>
    </div>
  );
}
