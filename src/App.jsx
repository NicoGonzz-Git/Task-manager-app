import './App.css';
import Header from './components/common/header/Header';
import Footer from './components/common/footer/Footer';
import Calendar from './components/calendar/Calendar';
import UserList from './components/users/UsersList';
import UserDetails from './components/users/UsersDetails';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './components/common/not-found/NotFound';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="*" element={ <NotFound />} />
        <Route path="/" element={<Calendar />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:userId" element={<UserDetails/>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;