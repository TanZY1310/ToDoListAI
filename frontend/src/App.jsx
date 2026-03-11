import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import TaskCreate from "./components/TaskCreate";
import "flyonui/flyonui";

function App() {
  return (
      <Router>
        <div>
          <main>
            <Routes>
                <Route path={"/"} element={<TaskCreate/>} />
            </Routes>
          </main>
        </div>
      </Router>
  )
}

export default App
