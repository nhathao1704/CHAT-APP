import {createBrowserRouter} from 'react-router-dom';
import App from './App';
import Login from '../page/login.jsx';
import Register from '../page/register.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
    ],
  },
]);
export default router;