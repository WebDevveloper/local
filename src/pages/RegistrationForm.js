import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './css/RegistrationForm.css';

export default function RegistrationForm() {
  const navigate = useNavigate();

  const handdleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/registration", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        FIO: document.getElementById('FIO').value,
        email: document.getElementById('email').value,
        phone_number: document.getElementById('phone_number').value,
        login: document.getElementById('login').value,
        pass: document.getElementById('pass').value

      }),
    });
    const data = await res.json();
    if (res.ok) {
      alert('Registration successful');
      localStorage.setItem('user', JSON.stringify(data));  // сохраняем любые данные, например токен или просто флаг :contentReference[oaicite:0]{index=0}
      navigate('/');
    }
    console.log(data)
  }


  return (
    <div className="form-container">
        <form onSubmit={handdleSubmit}>
            <label>ФИО</label>
            <input 
              type="text" 
              id="FIO" 
              key="FIO" 
              required 
              pattern="^[А-ЯЁ][а-яё]+( [А-ЯЁ][а-яё]+){1,2}$"
              placeholder="Иванов Иван Иванович">

            </input>

            <label>Электронная почта</label>
            <input 
              type="email" 
              id="email" 
              key="email" 
              required
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              placeholder="example@domain.com">

            </input>

            <label>Номер телефона</label>
            <input 
              type="text"
              id="phone_number"
              required
              // pattern="^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$"
              placeholder="+7 (916)-456-78-90">

            </input>

            <label>Логин</label>
            <input 
              type="text" 
              id="login" 
              key="login" 
              required
              placeholder='login'>

            </input>
            <label>Пароль</label>
            <input 
              type="password" 
              id="pass" 
              key="pass" 
              required 
              pattern=".{6,}"
              placeholder="минимум 6 символов">

            </input>

            <button type="submit">Зарегистрироваться</button>

            <p>Уже есть аккаунт? <Link to='/login'>Войти</Link></p>
            
        </form>
    </div>
  )
}
