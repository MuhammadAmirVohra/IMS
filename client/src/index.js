import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Bus from './components/Bus';

window.flash = (message, type="success") => Bus.emit('flash', ({message, type}));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
