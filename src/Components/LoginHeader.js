import React, { Component } from 'react';
import LogOut from './LogOut';
import Login from './Login';
import fire from '../config/fire';

class LoginHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
        }
    }

    componentDidMount() {
        this.authListener();
    }
    authListener() {
        fire.auth().onAuthStateChanged((user) => {
            //console.log(user);
            if (user) {
                this.setState({ user });
                //localStorage.setItem('user', user.uid);
            } else {
                this.setState({ user: null });
                //localStorage.removeItem('user');  
            }
        })
    }
    render() {
        return (
            <div>
                <br />
                {this.state.user ?
                    (<div><p>Welcome {this.state.user.email}</p><LogOut /></div>)
                    :
                    (<div><p>Please log in.</p><Login /></div>)}
            </div>
        )
    }
}


export default LoginHeader;