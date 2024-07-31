// import React, { useEffect, useState } from 'react';

// const AuthCheck = () => {
//   const [authStatus, setAuthStatus] = useState(null);

//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/auth/check-auth', {
//           method: 'GET',
//           credentials: 'include', // This ensures cookies are sent with the request
//         });

//         const data = await response.json();
//         if (data.authenticated) {
//           console.log('User is authenticated', data.userId);
//           setAuthStatus('Authenticated');
//         } else {
//           console.log('User is not authenticated');
//           setAuthStatus('Not Authenticated');
//         }
//       } catch (error) {
//         console.error('Error checking auth status:', error);
//         setAuthStatus('Error');
//       }
//     };

//     checkAuthStatus();
//   }, []);

//   return <div>Authentication Status: {authStatus}</div>;
// };

// export default AuthCheck;
