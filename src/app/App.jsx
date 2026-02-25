import {Outlet} from 'react-router-dom';
import Header from '../component/header';
const App = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
export default App;