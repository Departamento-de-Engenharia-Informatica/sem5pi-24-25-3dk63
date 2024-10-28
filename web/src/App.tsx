// App.jsx
import { useState } from 'react';
import './App.css';
import Login from './Login.tsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <>
        {isLoggedIn ? (
          <div>
          </div>
        ) : (
          <Login setIsLoggedIn={setIsLoggedIn} />
        )}
      </>
    </ThemeProvider>
  );
}

export default App
