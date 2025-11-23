import { Routes, Route } from 'react-router-dom'
import { Testing } from './pages/Testing'
import Layout from './components/Layout'
import Home from './pages/Home'
import Solve from './pages/Solve'
import Result from './pages/Result'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="testing" element={<Testing />} />
        <Route path="solve/:questionId" element={<Solve />} />
        <Route path="result/:questionId" element={<Result />} />
      </Route>
    </Routes>
  )
}

export default App
