import './App.css'
import Dashboard from './components/Dashboard'
import AddNews from './components/AddNews'
import SignUp from './components/SignUp'
import {Routes ,Route} from 'react-router-dom';
import Login from './components/Login';
function App() {
   
  
  return (
    <div className="App">
      {/* <SignUp/>
      <AddNews/> */}
      <Routes>
        <Route path="/signup" element={<SignUp/>}  />
        <Route path="/login" element={<Login/>} />
        <Route path="/api/add" element={<AddNews/>} />
        <Route path="/api/dashboard" element={<Dashboard/>} />
      </Routes>
    </div>
  )
}

export default App
