import React, { Component } from 'react';
import fire from '../config/fire';
import { Button } from 'antd';

class LogOut extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.state = {
            loggedIn: this.props.loggedIn
        }
    }

    logout() {
        fire.auth().signOut()
    }


    render() {
        const style = {
            backgroundColor: 'red',
            color: 'white',
        };

        return (
            <div>
                <div className="form">
                    <Button style={style} onClick={this.logout}>Logout</Button>
                </div>
            </div>
        );

    }

}

export default LogOut;