import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import logo from './logo.svg';
import { Food } from './container/index'
import './App.css';

class App extends Component {
  render() {
    return (
      <Router basename='/client/restaurant-m'>
        <div>
          <Route path="/" exact component={Food} />
        </div>
      </Router>
    );
  }
}

export default App;
