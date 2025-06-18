import React, { useEffect, useState } from 'react';
import './css/AdminStatus.css';

export default function AdminStatus() {
   const [orders, setOrders] = useState([]);
    const [orderEdits, setOrderEdits] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/orders/admin-all-orders', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(r => r.json())
      .then(setOrders)
      .catch(console.error);
  }, []);

  const handleOrderChange = (id, field, value) => {
    setOrderEdits(edits => ({
      ...edits,
      [id]: { ...(edits[id] || {}), [field]: value }
    }));
  };

  const saveOrder = async (id) => {
    const edits = orderEdits[id] || {};
    const status = edits.status;
    const reason = edits.reason || null;

    if (!status) {
      return alert('Пожалуйста, выберите статус');
    }
    if (status === 'книга отсутствует' && !reason) {
      return alert('Укажите причину отсутствия');
    }

    const token = localStorage.getItem('token');
    await fetch('http://localhost:5000/api/orders/update-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ id, status, reason })
    });

    setOrders(orders.map(o =>
        o.id === id ? { ...o, status, reason } : o
      ));
      setOrderEdits(edits => {
        const copy = { ...edits };
        delete copy[id];
        return copy;
      });
  };

  return (
    <div className="admin-container">
      <h2>Панель администратора</h2>

      {/* --- Orders Table --- */}
      <div className="admin-section">
        <h3>Заявки пользователей</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>ФИО</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Книга</th>
              <th>Иная книга</th>
              <th>Дата</th>
              <th>Время</th>
              <th>Статус</th>
              <th>Причина</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, idx) => {
              const edits = orderEdits[o.id] || {};
              const currentStatus = edits.status ?? o.status;
              return (
                <tr key={o.id}>
                  <td>{idx + 1}</td>
                  <td>{o.fio}</td>
                  <td>{o.phone_number}</td>
                  <td>{o.email}</td>
                  <td>{o.service}</td>
                  <td>{o.custom_service || '—'}</td>
                  <td>{o.order_date}</td>
                  <td>{o.order_time}</td>
                  <td>
                    <select
                      value={currentStatus}
                      onChange={e => handleOrderChange(o.id, 'status', e.target.value)}
                    >
                      <option value="новая заявка">новая заявка</option>
                      <option value="услуга оказана">услуга оказана</option>
                      <option value="услуга отменена">услуга отменена</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={edits.reason ?? o.reason ?? ''}
                      placeholder="Причина"
                      disabled={currentStatus !== 'услуга отменена'}
                      onChange={e => handleOrderChange(o.id, 'reason', e.target.value)}
                    />
                  </td>
                  <td>
                    <button className='btn' type="button" onClick={() => saveOrder(o.id)}>Сохранить</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>
  );
}
