// استيراد المكتبات
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Reports from './components/Reports';
import Goals from './components/Goals';
import Header from './components/Header'; // إضافة رأس للتطبيق
import './App.css'; // استيراد ملف CSS

// مكون التطبيق الرئيسي
function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Switch>
            <Route path="/reports" component={Reports} />
            <Route path="/goals" component={Goals} />
            {/* يمكن إضافة مسارات أخرى هنا */}
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
