import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // нет токена → на логин
      return;
    }

    fetch('http://localhost:5000/api/orders/all-orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) {
            // токен просрочен или нет
            localStorage.removeItem('token');
            navigate('/');
            return null;
          }
          throw new Error('Ошибка загрузки заявок');
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(err => {
        console.error(err);
        alert(err.message);
      });
  }, [navigate]);

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h2>История заявок</h2>

      <div style={{ textAlign: 'right', margin: '1rem 0' }}>
        <Link to="/create-orders"><button>Новая заявка</button></Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>#</th>
            <th style={th}>Книга</th>
            <th style={th}>Дата</th>
            <th style={th}>Время</th>
            <th style={th}>Адрес</th>
            <th style={th}>Статус</th>
            <th style={th}>Причина</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={o.id}>
              <td style={td}>{i + 1}</td>
              <td style={td}>{o.service}</td>
              <td style={td}>{o.order_date}</td>
              <td style={td}>{o.order_time}</td>
              <td style={td}>{o.adress}</td>
              <td style={td}>{o.status}</td>
              <td style={td}>{o.reason || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { border: '1px solid #ccc', padding: '8px', background: '#fff' };
const td = { border: '1px solid #ccc', padding: '8px', background: '#fff' };
