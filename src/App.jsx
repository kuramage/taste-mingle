import React from 'react';
import ReactDOM from 'react-dom';
import SwipeDeck from './components/SwipeDeck';

const App = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Swipe Images</h1>
      <SwipeDeck />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
export default App; 