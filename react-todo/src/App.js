import React, { Component } from 'react';

import Todos from './containers/todo-container';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Todos/>
      </div>
    );
  }
}

export default App;
