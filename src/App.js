import React, { useState, useEffect } from 'react';
import FASTAViewer from './FASTAViewer';
import Help from './Help';
import './App.css';

function App() {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowHelp(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="App relative">
      <FASTAViewer />
      
      {/* 帮助按钮 */}
      <button 
        className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={() => setShowHelp(!showHelp)}
      >
        ?
      </button>

      {/* 帮助模态框 */}
      {showHelp && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">帮助</h2>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                关闭
              </button>
            </div>
            <Help />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;