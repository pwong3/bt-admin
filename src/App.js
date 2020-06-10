import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import './Components/BTHeader.css';
import BTHeader from './Components/BTHeader';
import AdminPage from './Pages/AdminPage';
import { BrowserRouter as Router } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <BTHeader />
          <AdminPage />
        </Router>
      </div>
    );
  }
}

export default App;
