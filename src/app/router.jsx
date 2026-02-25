import {createBrowserRouter} from 'react-router-dom';
import App from './App';
import Login from '../page/login.jsx';
import Register from '../page/register.jsx';
import ResetPassword from '../page/reset-password.jsx';
import VerifyOtp from '../page/verify.jsx';
import AuthLayout from './authlayout.jsx';
import ForgotPassword from '../page/forgot-password.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
        {
          index: true,
           element: <h1>Welcome</h1>,
        },
    ],
  },
   {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword/>,
      },
      {
        path: "/verify",
        element: <VerifyOtp />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />
      },
    ],
   },
 ]);
export default router;