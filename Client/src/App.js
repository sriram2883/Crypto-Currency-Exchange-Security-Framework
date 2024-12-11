import './App.css';
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Market from './components/Market';
import Login from './components/Login';
import CoinDetails from './components/CoinDetails';
function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/market" element={<Market/>} />
          <Route path="/coin/:id" element={<CoinDetails/>} />
          <Route path="/portfolio" element={<div>Portfolio</div>} />
          <Route path='/login' element={<Login/>} />
          <Route path="/about" element={<About/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
