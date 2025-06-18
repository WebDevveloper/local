import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/FormStyles.css';

export default function CreateOrder() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    service_id: '', useOther: false, custom_service: '',
    date: '', time: '', address: '', phone: ''
  });
  const [services, setServices] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/services/get-service', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(r => r.json())
      .then(setServices)
      .catch(console.error);
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type==='checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const payload = {
      // user_id:       form.id,
      service_id:    form.service_id,
      custom_service: form.useOther ? form.custom_service : null,
      order_date:    form.date,
      order_time:    form.time,
      adress:        form.address,
      phone_number:  form.phone,
      status:        'новая заявка'
    };

    const res = await fetch('http://localhost:5000/api/orders/new-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) window.location.href = '/orders';
    else {
      const err = await res.json();
      alert(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Новая заявка</h2>
      <form onSubmit={handleSubmit}>
        {/* Список Книг из БД */}
        <label>Книг</label>
        <select
          name="service_id"
          value={form.service_id}
          onChange={handleChange}
          required
        >
          <option value="">— выберите —</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {/* Чекбокс «Иная книга */}
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="useOther"
            checked={form.useOther}
            onChange={handleChange}
          />
          Иная книга
        </label>

        {/* Поле для ввода, если чекбокс отмечен */}
        {form.useOther && (
          <>
            <label>Опишите услугу</label>
            <textarea
              name="custom_service"
              value={form.custom_service}
              onChange={handleChange}
              required
            />
          </>
        )}

        {/* Остальные поля */}
        <label>Дата</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />

        <label>Время</label>
        <input type="time" name="time" value={form.time} onChange={handleChange} required />

        

        <label>Адрес</label>
        <input type="text" name="address" value={form.address} onChange={handleChange} required />

        <label>Телефон</label>
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />

        <button type="submit">Отправить</button>
      </form>
    </div>
  );
}
