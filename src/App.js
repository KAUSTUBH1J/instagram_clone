import './App.css';
import {React,useState, useEffect, useContext} from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './component/Home';
import Nav from './component/Navbar';
import Loader from './component/smallComponent/loader';
import { ThemeContext } from './component/context';
import Profile from './component/Profile';
import Login from './component/login/login';
import Signup from './component/login/signup';
import Create from './component/post/crate_post'
import axios from './utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

function LoaderWrapper() {
  const [loader, setLoader] = useState(false);
  const { isDarkMode} = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Function to fetch posts from API
  const checkToken = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get('/users/verify-token',token); // API call to fetch posts/api/v1/
      console.log('response'); // Assuming 'posts' is the key in response data
      console.log(response);
    } catch (err) {
      console.error('Error fetching posts:', err);
      // console.log("============"+location.pathname)
      if(location.pathname !== '/login'){
        // navigate('/login');
      }
    } finally {
      setLoader(false);
    }
  };


  useEffect(()=>{
      console.log(location.pathname);
      setLoader(true)
        // Timeout for loader
        console.log("location change");
        checkToken();
        const timeoutId = setTimeout(() => {
          
        }, 1000);
    
        // Cleanup timeout
        return () => clearTimeout(timeoutId);
    
  },[location]);

  const showNavbar = location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <>
      {loader && <Loader/>}
      
      <main style={{display : loader ? 'none': 'block',  background: isDarkMode ? '#333':'rgb(241 241 241)', height: '100%' }  }>
          {showNavbar && <Nav />}
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/Profile" element={<Profile/>}/>
            <Route path="/create" element={<Create/>}/>
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      
      <LoaderWrapper />
    
    </Router>
  );
}

export default App;
