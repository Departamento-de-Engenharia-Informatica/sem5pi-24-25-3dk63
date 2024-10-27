import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import axios from 'axios'; 
import Login from './Login';

function App() {
  const [count, setCount] = useState(0);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchStaff = async () => {
    try {
      const response = await axios.get('https://localhost:5001/api/staff');
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchStaff();
    }
  }, [isLoggedIn]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      {isLoggedIn ? (
        <div>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.jsx</code> and save to test HMR
            </p>
          </div>

          {loading ? (
            <p>Loading staff data...</p>
          ) : (
            <div>
              <h2>Staff List</h2>
              <ul className="staff-list">
                {staff.map((member) => (
                  <li key={member.id}>{member.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
