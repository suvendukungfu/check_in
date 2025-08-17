import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Checkin from './pages/Checkin'
import Admin from './pages/Admin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkin" element={<Checkin />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App