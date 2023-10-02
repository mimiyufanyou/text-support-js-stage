import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'password') {
      alert('Logged in successfully!');
      // Here, you can redirect the user, set a token, etc.
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p>{error}</p>}
        <button onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
};

export default Login;