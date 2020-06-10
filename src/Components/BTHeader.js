import React, { Component } from 'react';
import LoginHeader from './LoginHeader'
import { Link } from 'react-router-dom';

class BTHeader extends Component {

  render() {
    return (
      <div>
        <div className="Header">
          <div className="Logo">
            <Link to='/'>
              <img
                max-height='150'
                width='auto'
                src="BestTileLogo.jpg"
                alt="BTLogo"
              />
            </Link>
          </div>
          <div>
            <LoginHeader />
          </div>
        </div>
      </div>
    )
  }
}

export default BTHeader;