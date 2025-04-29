import './App.css';
import Header from './components/common/header/Header';
import Footer from './components/common/footer/Footer';
import Calendar from './components/calendar/Calendar';
import UserList from './components/users/users';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="*" element={<Calendar />} />
        <Route path="/" element={<Calendar />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/users" element={<UserList />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;