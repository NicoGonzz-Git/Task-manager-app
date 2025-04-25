import './App.css';
import Header from './components/common/header/Header';
import Footer from './components/common/footer/Footer';
import Calendar from './components/calendar/Calendar';
import UserList from './components/users/users';

function App() {
  return (
    <div className="">
      <header className="App-header">
        <Header />
      </header>

      <main className="">
        <Calendar />
      </main>
      
        <UserList />
        
      <footer className="">
        <Footer />
      </footer>
    </div>
  );
}

export default App;