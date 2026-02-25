import {createBrowserRouter} from 'react-router-dom';
import App from './App';
import Login from '../page/login.jsx';
import Register from '../page/register.jsx';
import AuthLayout from './authlayout.jsx';

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
        ],
      },
    ]);
export default router;