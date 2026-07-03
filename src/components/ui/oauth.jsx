import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import api from '@/api';

function GoogleAuth({ onSuccess, onError }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="text-sm text-red-600">
        Google login is not configured yet. Add VITE_GOOGLE_CLIENT_ID to your .env file.
      </div>
    );
  }

  return (
    <GoogleLogin
      clientId={clientId}
      onSuccess={async (response) => {
        const credential = response?.credential || response?.tokenId;
        if (!credential) {
          const error = new Error('No Google credential returned');
          console.error('GoogleLogin onSuccess response:', response);
          if (onError) {
            onError(error);
          }
          return;
        }

        try {
          const res = await api.post('/api/auth/google/', {
            credential,
          });

          const data = res.data;
          localStorage.setItem('access', data.access);
          localStorage.setItem('refresh', data.refresh);

          if (onSuccess) {
            onSuccess(data);
          } else {
            navigate('/', { replace: true });
          }
        } catch (err) {
          console.error('Google auth failed:', err.response?.data || err.message || err);
          if (onError) {
            onError(err);
          }
        }
      }}
      onError={(err) => {
        console.log('Login Failed', err);
        if (onError) {
          onError(err || new Error('Google login failed'));
        }
      }}
    />
  );
}

export default GoogleAuth;