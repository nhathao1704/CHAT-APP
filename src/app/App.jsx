import {Outlet} from 'react-router-dom';
import Header from '../component/header.jsx';
import "../styles/App.css"
const App = () => {
  return (
    <div className="layout">
      <Header />
      <Outlet />
    </div>
  );
};
export default App;