import React, { Component } from 'react';
import fire from '../config/fire';
import { Button, Input } from 'antd';

class Login extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        //this.signup = this.signup.bind(this);
        this.state = {
            email: '',
            password: '',
            loggedIn: false
        };
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    login(e) {
        e.preventDefault();
        fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .catch((error) => {
                console.log(error);
            });
    }

    onKeyPress(e) {
        if (e.key === 'Enter') {this.login(e)}
    }

    /*signup(e) {
        e.preventDefault();
        fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .catch((error) => {
                console.log(error);
            })
    }
    */

    render() {
        return (
            <div className="form">
                <Input
                    style={style.TextField}
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    size="medium"
                    placeholder="Email"
                    onPressEnter={this.onKeyPress}
                />
                <Input
                    style={style.TextField}
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    size="medium"
                    placeholder="Password"
                    onKeyPress={this.onKeyPress}
                />
                <Button size="medium" variant='contained' style={style.Button} onClick={this.login}>
                    Login
                </Button>
            </div>
            /*
                <Button variant='contained' color='primary' onClick={this.signup}>
                    Signup
                </Button>
                */

        );
    }
}

const style = {
    Button: {
        backgroundColor: 'red',
        color: 'white',
    },
    TextField: {
        margin: 5,
        width: 250
    }
};
export default Login;