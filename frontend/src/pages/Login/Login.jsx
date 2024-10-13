import { useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  FormLabel,
  FormControl
} from '@chakra-ui/react';

import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Logar</h2>
          <div className="form-group">
            <FormControl>
                <FormLabel>Email</FormLabel>
                <Input placeholder='email' />
            </FormControl>
          </div>
          <div className="form-group">
            <FormControl>
                <FormLabel>Senha</FormLabel>
                <Input placeholder='senha' />
            </FormControl>
          </div>
          <Button onClick={handleLogin}>Entrar</Button>
      </div>
    </div>
  );
};

export default Login;
