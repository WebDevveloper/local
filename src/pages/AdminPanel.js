import React, { useEffect, useState } from 'react';
import './css/AdminPanel.css';

export default function AdminPanel() {
  // --- State for orders ---
  const [orders, setOrders] = useState([]);
  const [orderEdits, setOrderEdits] = useState({});

  // --- State for services ---
  const [services, setServices] = useState([]);
  const [serviceEdits, setServiceEdits] = useState({});
  const [newServiceName, setNewServiceName] = useState('');

  // Fetch data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch all orders for admin
    fetch('http://localhost:5000/api/orders/admin-all-orders', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(console.error);

    // Fetch services
    fetch('http://localhost:5000/api/services/get-service', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(console.error);
  }, []);

  // --- Handlers for Orders ---
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
    try {
      await fetch('http://localhost:5000/api/orders/update-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ id, status, reason })
      });
      // Update local state
      setOrders(orders.map(o =>
        o.id === id ? { ...o, status, reason } : o
      ));
      setOrderEdits(edits => {
        const copy = { ...edits };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении статуса');
    }
  };

  // --- Handlers for Services ---
  const handleServiceEditChange = (id, value) => {
    setServiceEdits(edits => ({
      ...edits,
      [id]: value
    }));
  };

  const saveServiceEdit = async (id) => {
    const name = serviceEdits[id]?.trim();
    if (!name) return alert('Введите новое название услуги');

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/services/edit-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ id, name })
      });
      const updated = await res.json();
      setServices(services.map(s =>
        s.id === id ? updated : s
      ));
      setServiceEdits(edits => {
        const copy = { ...edits };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      console.error(err);
      alert('Ошибка при обновлении услуги');
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm('Удалить эту услугу?')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:5000/api/services/dell-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ id })
      });
      setServices(services.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении услуги');
    }
  };

  const addService = async () => {
    const name = newServiceName.trim();
    if (!name) return alert('Введите название услуги');

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/services/add-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ name })
      });
      const added = await res.json();
      setServices([...services, added]);
      setNewServiceName('');
    } catch (err) {
      console.error(err);
      alert('Ошибка при добавлении услуги');
    }
  };

  return (
    <div className="admin-panel">
      <h2>Панель администратора</h2>

      {/* --- Orders Table --- */}
      <div className="admin-section">
        <h3>Заявки пользователей</h3>
        <div className='table-container'>
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

      {/* --- Services Section --- */}
      <div className="admin-section">
        <h3>Управление услугами</h3>
        {/* Add form above table */}
        <div className="add-service-form">
          <input
            type="text"
            placeholder="Название новой услуги"
            value={newServiceName}
            onChange={e => setNewServiceName(e.target.value)}
          />
          <button className='btn' type="button" onClick={addService}>Добавить</button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Название услуги</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, idx) => {
              const isEditing = serviceEdits.hasOwnProperty(s.id);
              return (
                <tr key={s.id}>  
                  <td>{idx + 1}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={serviceEdits[s.id]}
                        onChange={e => handleServiceEditChange(s.id, e.target.value)}
                      />
                    ) : (
                      s.name
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <>
                        <button className='btn' type="button" onClick={() => saveServiceEdit(s.id)}>Сохранить</button>
                        <button className='btn' type="button" onClick={() => setServiceEdits(edits => { const c = {...edits}; delete c[s.id]; return c; })}>
                          Отмена
                        </button>
                      </>
                    ) : (
                      <>
                        <button className='btn' type="button" onClick={() => handleServiceEditChange(s.id, s.name)}>Изменить</button>
                        <button className='btn' type="button" onClick={() => deleteService(s.id)}>Удалить</button>
                      </>
                    )}
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
