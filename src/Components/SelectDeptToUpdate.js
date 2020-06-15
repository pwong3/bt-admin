import React, { Component } from 'react';
import {
    Select,
} from 'antd';
import UpdateDB from './UpdateDB';
import ShowAddNewModal from '../Helpers/ShowAddNewModal';
import { Route, withRouter } from 'react-router-dom';

const deptsList = [
    'Accessories',
    'Bath Vanities',
    'Cleaners & Sealers',
    'Countertops',
    'Faucets',
    'Grout & Mortars',
    'Kitchen Sinks',
    'Kitchen Cabinets',
    'Schluter Systems',
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
        this.setState({dept: value})
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
                <div style={{marginRight: 10}}>
                    <div>Select a department.</div>
                    <Select
                        style={{ width: '170px' }}
                        placeholder="Department"
                        onChange={this.handleChange}
                    >
                        {deptsList.map(dept => (
                            <Option key={dept} value={dept}>{dept}</Option>
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
            {deptsList.map(dept => (
                <Route
                    key={dept}
                    path={`/${dept}`}
                    render={() => <UpdateDB deptPassed={dept} />}
                />
            ))}
        </div>
    );
}

export default SelectDeptToUpdate;