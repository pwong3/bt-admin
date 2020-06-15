import React, { Component } from 'react';
import LoginHeader from './LoginHeader'
import { Link } from 'react-router-dom';

class BTHeader extends Component {

  render() {
    return (
      <div className="Header">
        <Link to='/'>
          <img
            height='120'
            width='auto'
            src="BestTileLogo.jpg"
            alt="BTLogo"
          />
        </Link>
        
        <LoginHeader />
      </div>
    )
  }
}

export default BTHeader;