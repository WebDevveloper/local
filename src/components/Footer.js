import React from 'react';
import './css/Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer fade-in">
      <div>© 2025 Books-Lover</div>
      <div>
        <a href="/policy">Политика конфиденциальности</a> |{' '}
        <a href="/contact">Контакты</a>
      </div>
    </footer>
  );
}