// LoginUserForm.jsx
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LoginUserForm = () => {
  const { login, refreshToken } = useContext(AuthContext);
  const [data, setLoginData] = useState({
    user_email: '',
    password: ''
  });
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev, [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (data.user_email.length === 0 || !data.user_email.includes('@')) {
        toast.error('Enter Correct Email', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000
        });
      } else if (data.password.length < 8) {
        toast.error('Password must be at least 8 characters', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000
        });
      } else {
        const response = await axios.post('http://localhost:4000/api/user/loginUser', data);
        if (response.status === 200) {
          const { accessToken, refreshToken } = response.data;

          sessionStorage.setItem('accessToken', accessToken);
          sessionStorage.setItem('refreshToken', refreshToken);

          login(accessToken);
          history.replace('/dashboard');

          toast.success(`Login Successful ${data.user_email}`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
        } else if (response.status === 401) {
          const newAccessToken = await refreshToken();

          if (newAccessToken) {
            await handleLogin(e);
          } else {
            toast.error('Invalid username/password', {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 3000,
            });
          }
        } else {
          console.error('Authentication Failed');
          toast.error('Authentication Failed', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Invalid username/password', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="flex flex-col bg-white p-52 rounded-lg shadow-md gap-5">
        <h1 className="text-2xl text-center font-bold mb-4">Welcome User</h1>
        <h1 className="text-2xl text-center font-bold mb-4">Sign In to Game Box</h1>
        <label className="block">Email</label>
        <input
          type="text"
          placeholder="Enter your Email"
          name="user_email"
          value={data.user_email}
          onChange={handleChange}
          className="input-field mb-4 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <label className="block">Password</label>
        <input
          type="password"
          placeholder="Enter Your Password"
          name="password"
          value={data.password}
          onChange={handleChange}
          className="input-field mb-4 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-5"
        >
          Login
        </button>
        <Link to="/userRegForm" className="text-blue-500 hover:underline">
          Register a user
        </Link>
        <Link to="/ForgotPassword" className="text-blue-500 hover:underline mt-2">
          Forgot Password?
        </Link>
        <ToastContainer />
      </form>
    </div>
  );
};

export default LoginUserForm;


// import React, { useContext, useState } from 'react';
// import axios from 'axios';
// import { AuthContext } from './AuthContext';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useHistory } from 'react-router-dom'; // Import useHistory hook from react-router-dom
// import { Link } from 'react-router-dom/cjs/react-router-dom.min';

// const LoginUserForm = () => {
//   const { login, refreshToken } = useContext(AuthContext);
//   const [data, setLoginData] = useState({
//     user_email: '',
//     password: ''
//   });
//   const history = useHistory(); // Initialize useHistory hook

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLoginData(prev => ({
//       ...prev, [name]: value
//     }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       if (data.user_email.length === 0 || !data.user_email.includes('@')) {
//         toast.error('Enter Correct Email', {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 3000
//         })
//       } else if (data.password.length < 8) {
//         toast.error('Password must be at least 8 characters', {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 3000
//         })
//       } else {
//         const response = await axios.post('http://localhost:4000/api/user/loginUser', data)
//         if (response.status === 200) {
//           const { accessToken, refreshToken } = response.data;

//           sessionStorage.setItem('accessToken', accessToken);
//           sessionStorage.setItem('refreshToken', refreshToken);

//             login(accessToken);
//             login("user")
//           // Use history.replace to navigate to a different page and replace the current entry in the history stack
//           history.replace('/dashboard');

//           toast.success(`Login Successful ${data.user_email}`, {
//             position: toast.POSITION.TOP_RIGHT,
//             autoClose: 3000,
//           })
//         } else if (response.status === 401) {
//           const newAccessToken = await refreshToken();

//           if (newAccessToken) {
//             await handleLogin(e);
//           }
//           else {
//             toast.error('Invalid username/password', {
//               position: toast.POSITION.TOP_RIGHT,
//               autoClose: 3000,
//             })
//           }
//         } else {
//           console.error('Authentication Failed');
//           toast.error('Authentication Failed', {
//             position: toast.POSITION.TOP_RIGHT,
//             autoClose: 3000,
//           })
//         }
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Invalid username/password', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       })
//     }
//   }

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//           <form onSubmit={handleLogin} className="flex flex-col bg-white p-52 rounded-lg shadow-md gap-5">
//               <h1 className='text-2xl text-center font-bold'>
//                   Welcome User
//               </h1>
//         <h1 className="text-2xl text-center font-bold mb-4">Sign In to Game Box</h1>
//         <label className="block">Email</label>
//         <input
//           type="text"
//           placeholder="Enter your Email"
//           name="user_email"
//           value={data.user_email}
//           onChange={handleChange}
//           className="input-field mb-4 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
//         />
//         <label className="block">Password</label>
//         <input
//           type="password"
//           placeholder="Enter Your Password"
//           name="password"
//           value={data.password}
//           onChange={handleChange}
//           className="input-field mb-4 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
//         />
//         <button
//           type="submit"
//           className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-5"
//         >
//           Login
//         </button>
//         <Link to="/userRegForm" className="text-blue-500 hover:underline">
//           Register a user
//         </Link>
//         <ToastContainer />
//       </form>
//     </div>
//   );
// };

// export default LoginUserForm;