import {createBrowserRouter} from 'react-router-dom';
import App from './App';
import Login from '../page/auth/login.jsx';
import Register from '../page/auth/register.jsx';
import ResetPassword from '../page/auth/reset-password.jsx';
import VerifyOtp from '../page/auth/verify.jsx';
import AuthLayout from './authlayout.jsx';
import ForgotPassword from '../page/auth/forgot-password.jsx';
import RequireAuth from './RequireAuth';
import Home from '../page/home.jsx';

const router = createBrowserRouter([
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
  {
    path: "/",
    element: (
      <RequireAuth>
        <App />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
 ]);
export default router;