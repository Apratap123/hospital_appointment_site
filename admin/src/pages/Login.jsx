
// import React, { useState, useContext } from 'react';
// import { assets } from '../assets/assets';
// import axios from 'axios';
// import { AdminContext } from '../context/AdminContext';
// import { toast } from 'react-toastify';

// const Login = () => {
//   const [state, setState] = useState('Admin');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const { setAToken, backendUrl } = useContext(AdminContext);

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();

//     try {
//       const endpoint = state === 'Admin' ? '/api/admin/login' : '/api/doctor/login';

//       const { data } = await axios.post(`${backendUrl}${endpoint}`, { email, password });

//       if (data.success) {
//         localStorage.setItem('aToken', data.token);
//         setAToken(data.token);
//         toast.success(`${state} login successful!`);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       if (error.response) {
//         // Server responded with a status outside of the 2xx range
//         toast.error(error.response.data.message || 'Something went wrong!');
//       } else if (error.request) {
//         // No response was received
//         toast.error('Server unreachable. Please try again later.');
//       } else {
//         // Something happened while setting up the request
//         toast.error('An unexpected error occurred.');
//       }
//     }
//   };

//   return (
//     <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
//       <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[304px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
//         <p className="text-2xl font-semibold m-auto">
//           <span className="text-primary">{state}</span> Login
//         </p>
//         <div className="w-full">
//           <p>Email</p>
//           <input
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//             className="border border-[#DADADA] rounded-sm w-full p-2 mt-1"
//             type="email"
//             required
//           />
//         </div>
//         <div className="w-full">
//           <p>Password</p>
//           <input
//             onChange={(e) => setPassword(e.target.value)}
//             value={password}
//             className="border border-[#DADADA] rounded-sm w-full p-2 mt-1"
//             type="password"
//             required
//           />
//         </div>
//         <button className="bg-primary text-white w-full py-2 rounded-md text-base">Login</button>
//         {state === 'Admin' ? (
//           <p>
//             Doctor Login?{' '}
//             <span className="text-primary underline cursor-pointer" onClick={() => setState('Doctor')}>
//               Click here
//             </span>
//           </p>
//         ) : (
//           <p>
//             Admin Login?{' '}
//             <span className="text-primary underline cursor-pointer" onClick={() => setState('Admin')}>
//               Click here
//             </span>
//           </p>
//         )}
//       </div>
//     </form>
//   );
// };

// export default Login;








import React from 'react'
import axios from 'axios';
import { useState } from 'react'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';

const Login = () => {
  const [state, setState] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setAToken, backendUrl } = useContext(AdminContext)
  const {setDToken} = useContext(DoctorContext)

  const onSubmitHandler = async (event) => {

    event.preventDefault()
    try {
      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        if (data.success) {
          localStorage.setItem('aToken', data.token)
          setAToken(data.token)
        } else {
          toast.error(data.message)
        }
      } else {
        const {data} = await axios.post(backendUrl + '/api/doctor/login',{email,password})

        if (data.success) {
          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
          console.log(data.token);
          
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {

    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[304px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'> {state}</span> Login</p>
        <div className='w-full'>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded-sm w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded-sm w-full p-2 mt-1' type="password" required />
        </div>
        <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>
        {
          state === "Admin"
            ? <p>Doctor Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Doctor')}>Click here </span></p>
            : <p>Admin Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Admin')}>Click here </span></p>
        }
      </div>
    </form>
  )
}
export default Login




