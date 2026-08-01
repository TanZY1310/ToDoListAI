import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TaskCreate from "./components/TaskCreate";

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<TaskCreate />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
