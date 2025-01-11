import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import InsertStudent from './Comonents/InsertStudent';
import ViewStudent from './Comonents/ViewStudent';
import NotFound from './Comonents/NotFound';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<InsertStudent />} />
        <Route path="/view-details" element={<ViewStudent />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
