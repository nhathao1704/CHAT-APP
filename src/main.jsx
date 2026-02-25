import router from './app/router';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
