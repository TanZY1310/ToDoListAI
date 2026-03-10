import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import TaskCreate from "./components/TaskCreate";
import "flyonui/flyonui";

function App() {
  return (
      <Router>
        <div>
          <header>
            <h1>To Do List App</h1>
          </header>
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
