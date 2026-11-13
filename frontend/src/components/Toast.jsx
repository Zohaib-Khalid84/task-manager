import { useEffect, useState } from 'react';

export default function Toast() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, ...e.detail }]);
      setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3000);
    };
    window.addEventListener('toast', handler);
    return () => window.removeEventListener('toast', handler);
  }, []);

  return (
    <div className="toast-wrap">
      {items.map((t) => (
        <div key={t.id} className={t.type === 'error' ? 'toast error' : 'toast'}>{t.message}</div>
      ))}
    </div>
  );
}