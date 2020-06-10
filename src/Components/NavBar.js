import React, { Component } from 'react';
import {
    Paper,
    Tabs,
    Tab,
    Container,
} from '@material-ui/core';
import './NavBar.css'
import HomePage from '../Pages/HomePage';
import ProductsPage from '../Pages/ProductsPage';
import LocationsPage from '../Pages/LocationsPage';
import AboutUsPage from '../Pages/AboutUsPage';
import AdminPage from './AdminPage';
import NoMatchPage from '../Pages/NoMatchPage';
import Header from '../Components/Header';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink
} from 'react-router-dom';

class NavBar extends Component {
    render() {
        const { tabStyle } = styles;
        return (
            <Container>
                <Header />
                <br />
                <Router>
                    <Paper elevation={0} variant="outlined" position="static">
                        <Tabs>
                            <Tab
                                style={tabStyle}
                                label='Home'
                                to='/'
                                exact
                                activeStyle={{ color: 'red' }}
                                component={NavLink} />
                            <Tab
                                style={tabStyle}
                                label='Products'
                                to='/products'
                                exact
                                activeStyle={{ color: 'red' }}
                                component={NavLink} />
                            <Tab
                                style={tabStyle}
                                label='Locations'
                                to='/locations'
                                exact
                                activeStyle={{ color: 'red' }}
                                component={NavLink} />
                            <Tab
                                style={tabStyle}
                                label='About Us'
                                to='/aboutus'
                                exact
                                activeStyle={{ color: 'red' }}
                                component={NavLink} />
                        </Tabs>
                    </Paper>
                    <Switch>
                        <Route exact path='/'>
                            <HomePage />
                        </Route>
                        <Route exact path='/products'>
                            <ProductsPage />
                        </Route>
                        <Route exact path='/locations'>
                            <LocationsPage />
                        </Route>
                        <Route exact path='/aboutus'>
                            <AboutUsPage />
                        </Route>
                        <Route path='/admin'>
                            <AdminPage />
                        </Route>
                        <Route path="*">
                            <NoMatchPage />
                        </Route>
                    </Switch>
                </Router>
            </Container>
        )
    }
}
const styles = {
    tabStyle: {
        color: 'black',
    },
    colorTypography: {
        text: 'white',
    }
};

export default NavBar;