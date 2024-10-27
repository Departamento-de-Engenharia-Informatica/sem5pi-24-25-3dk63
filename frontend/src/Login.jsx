import PropTypes from 'prop-types';

function Login({ setIsLoggedIn }) {
  const handleLogin = () => {
    window.location.href = 'https://localhost:5001/api/login';

    setIsLoggedIn(true);
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Login com Google</button>
    </div>
  );
}

Login.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default Login;
