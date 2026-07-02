import { GoogleLogin } from '@react-oauth/google';

function GoogleAuth() {
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
        const res = await fetch("http://localhost:8000/api/auth/google/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credential: response.credential }),
        });

        const data = await res.json();
        console.log(data);
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
}

export default GoogleAuth;