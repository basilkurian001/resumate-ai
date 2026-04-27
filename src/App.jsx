import { useState } from 'react';
import './App.css'
import Landing from './pages/Landing';

export default function App() {
  const [showDemo, setShowDemo] = useState(false);
  return (
    <Landing />
  );
}