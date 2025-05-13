import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Authenticated = ({ children }) => {
  const token = localStorage.getItem('accessToken')
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/')
    }
  }, [token, navigate]);

  return <>
    {children}</>;
};
export default Authenticated;