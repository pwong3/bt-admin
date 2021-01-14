import React, { Component } from 'react';
import {
    Select,
} from 'antd';
import UpdateDB from './UpdateDB';
import ShowAddNewModal from '../Helpers/ShowAddNewModal';
import { Route, withRouter, Switch, NavLink } from 'react-router-dom';
import NoMatchPage from '../Pages/NoMatchPage';
import HomePage from '../Pages/HomePage';

const deptsList = [
    'Accessories',
    'Bath Vanities',
    'Cleaners & Sealers',
    'Countertops',
    'Faucets',
    'Grout & Mortars',
    'Kitchen Sinks',
    'Kitchen Cabinets',
    'Porcelain Panels',
    'Schluter Systems',
    'Shower & Tub Enclosures',
    'Stone Steps',
    'Stone Tiles',
    'Tiles',
    'Toilets',
    'Tools',
    'Vanity Tops',
];

class SelectMenu extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            dept: ''
        }
    }

    handleChange = (value) => {
        this.props.history.push(`/${value}`);
        this.setState({ dept: value })
    }
    render() {
        const { Option } = Select;
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row'
                }}
            >
                <div style={{ marginRight: 10 }}>
                    <div>Select a department.</div>
                    <Select
                        style={{ width: '170px' }}
                        placeholder="Department"
                        onChange={this.handleChange}
                    >
                        {deptsList.map(dept => (
                            <Option key={dept} value={dept}>
                                <NavLink to={dept} >
                                    {dept}
                                </NavLink>
                            </Option>
                        ))}
                    </Select>
                </div>
                <div>
                    <ShowAddNewModal deptPassed={this.state.dept} />
                </div>
            </div>
        )
    }
}
const Menu = withRouter(SelectMenu);

function SelectDeptToUpdate() {
    return (
        <div>
            <Menu />
            <Switch>
                {deptsList.map(dept => (
                    <Route
                        key={dept}
                        path={`/${dept}`}
                        render={() => <UpdateDB deptPassed={dept} />}
                    />
                ))}
                <Route exact path={'/'}>
                    <HomePage />
                </Route>
                <Route>
                    <NoMatchPage />
                </Route>
            </Switch>
        </div>
    );
}

export default SelectDeptToUpdate;