import { Routes, Route, Navigate } from 'react-router-dom';
import { Home, Login, Signup, Dashboard, Quiz, Results, NotFound } from './pages';

export default function App(){
  return <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/quiz" element={<Quiz/>}/>
    <Route path="/results" element={<Results/>}/>
    <Route path="/404" element={<NotFound/>}/>
    <Route path="*" element={<Navigate to="/404" replace/>}/>
  </Routes>;
}
