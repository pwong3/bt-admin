import React, { Component } from 'react';
import fire from '../config/fire';
import SelectDeptToUpdate from '../Components/SelectDeptToUpdate';
import { Route } from 'react-router-dom';
import HomePage from './HomePage';

class AdminPage extends Component {
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
                <Route path='/'>
                    {this.state.user ? (<SelectDeptToUpdate />) : <HomePage/>}
                </Route>
            </div>
        )
    }
}


export default AdminPage;