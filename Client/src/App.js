  import './App.css';
  import NavBar from './components/NavBar';
  import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
  import Home from './components/Home';
  import About from './components/About';
  import Market from './components/Market';
  import Login from './components/Login';
  import CoinDetails from './components/CoinDetails';
  import Portfolio from './components/portfolio';
  import { use, useEffect } from 'react';
  import axios from 'axios';
  function App() {
    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const fetchUser = async () => {
          try {
            const response = await axios.get('http://localhost:5000/', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log(response);
            if (response.data.userDetails) {
              console.log('User details fetched successfully:', response.data.userDetails);
            } else {
              localStorage.clear();
            }
          } catch (error) {
            localStorage.clear();
            console.error('Error fetching user details:', error);
          }
        };
    
        fetchUser(); // Call the function here
      }
    }, []); // Empty dependency array ensures this runs only once
    
    return (
      <>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/home" element={<Home/>} />
            <Route path="/market" element={<Market/>} />
            <Route path="/coin/:id" element={<CoinDetails/>} />
            <Route path="/portfolio" element={<Portfolio/>} />
            <Route path='/login' element={<Login/>} />
            <Route path="/about" element={<About/>} />
          </Routes>
        </Router>
      </>
    );
  }

  export default App;
