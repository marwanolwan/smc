// src/components/Goals.js
import React, { useState } from 'react';

const Goals = () => {
  const [goal, setGoal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // أضف كود لتخزين الهدف
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="أدخل هدفك"
      />
      <button type="submit">إضافة هدف</button>
    </form>
  );
};

export default Goals;
