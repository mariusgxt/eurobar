import './App.css'
import { useState } from 'react';
import Scanner from './Scanner';

function App() {
  const [showScanner, setShowScanner] = useState(false);

  const handleClick = () => {
    setShowScanner(true);
  };

  if (showScanner) {
    return <Scanner />;
  }

  return (
    <>
      <img src="/assets/europeLogo.png" alt="Eurobar Logo" style={{ width: '35%', marginTop: '-1500px' }} />
      <h1>
        Eurobar
      </h1>
      <button onClick={handleClick}>Click here to start</button>
      <p className="read-the-docs">
        Not official
      </p>
    </>
  )
}

export default App
