// Login.jsx
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

function Login({ setIsLoggedIn }: LoginProps) {
  const handleLogin = () => {
    window.location.href = 'https://localhost:5001/api/login';
    setIsLoggedIn(true);
  };

  return (
    <div>
      <h2>Login</h2>
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login com Google
      </Button>
    </div>
  );
}

Login.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default Login;
