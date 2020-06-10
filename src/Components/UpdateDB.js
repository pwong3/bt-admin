import React, { Component } from 'react';
import { Space, Card, Row, Col, Select, Checkbox } from 'antd';
import ShowUpdateModal from '../Helpers/ShowUpdateModal';
import ShowDeleteModal from '../Helpers/ShowDeleteModal';
import ShowAddNewModal from '../Helpers/ShowAddNewModal';
import ShowDuplicateModal from '../Helpers/ShowDuplicateModal';
import fire from '../config/fire';
import './UpdateDB.css';

const rootRef = fire.database().ref()
const deptRef = rootRef.child('Department');
const sortBy = [
    { name: 'Product Name', sort: 'productName' },
    { name: 'Product Size', sort: 'productSize' },
    { name: 'Product Color', sort: 'productColor' },
    { name: 'Recently Added', sort: '' }
]

class UpdateDB extends Component {
    constructor(props) {
        super(props);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.handleCheckedChange = this.handleCheckedChange.bind(this);
        this.filterByBrand = this.filterByBrand.bind(this);
        this.sortByName = this.sortByName.bind(this);
        this.state = {
            productsList: [],
            filteredProductsList: [],
            sortByKey: '',
            filterByKey: [],
            filtering: false
        };
    }

    componentDidMount() {
        const deptPassed = this.props.deptPassed;
        const productRef = deptRef.child(deptPassed).orderByChild('sortKey');
        productRef.on('value', (childSnapshot) => {
            const products = [];
            childSnapshot.forEach((product) => {
                products.push({
                    key: product.key,
                    productSeries: product.val().productSeries,
                    productBrand: product.val().productBrand,
                    productName: product.val().productName,
                    productModelNumber: product.val().productModelNumber,
                    productMaterial: product.val().productMaterial,
                    //      productPrice: product.toJSON().productPrice,
                    productMadeIn: product.val().productMadeIn,
                    productSize: product.val().productSize,
                    productColor: product.val().productColor,
                    productDescription: product.val().productDescription,
                    imageUrl: product.val().imageUrl,
                });
                this.setState({
                    productsList: products,
                });

            });
        });
    }
    handleSortChange = (value) => {
        this.setState({ sortByKey: value })
    }
    handleCheckedChange = (checkedValues) => {
        if (checkedValues.length > 0) {
            this.setState({
                filterByKey: checkedValues,
                filtering: true,
                filteredProductsList: []
            },
                //callback to render immediately when checkboxes are checked
                () => this.filterByBrand()
            )
        }
        else {
            this.setState({
                filteredProductsList: [],
                filtering: false
            })
        }

    }
    filterByBrand = () => {
        const { filterByKey, productsList } = this.state;
        const tempProdList = [];
        filterByKey.forEach((filter) => {
            const eachFilterProdList = productsList.filter(prod => prod.productBrand === filter);
            eachFilterProdList.forEach((item) =>
                tempProdList.push(item)
            )
        })
        this.setState({ filteredProductsList: tempProdList })
    }
    sortByName = (sort, list) => {
        const sortProdList = list;
        return sortProdList.sort((a, b) =>
            (a[sort].toLowerCase() > b[sort].toLowerCase()) ? 1 : -1)
    }
    render() {
        const { Option } = Select;
        const { productsList, filtering, sortByKey, filteredProductsList } = this.state;
        const copyList = [...productsList]
        //get all unique brands
        const filterBy = [...new Set(productsList.map(prod => prod.productBrand))].sort((a, b) =>
            (a.toLowerCase() > b.toLowerCase()) ? 1 : -1);

        const productsDB = filtering === false ?
            //sortByName is using copyList so the filter checkboxes don't move when sorting
            (sortByKey === '' ? productsList : this.sortByName(sortByKey, copyList))
            :
            (sortByKey === '' ? filteredProductsList : this.sortByName(sortByKey, filteredProductsList))
        //this.sortByName(sortByKey);

        const { cardStyle, cardSpacing } = styles;
        return (
            <div >
                <header className={'Selections'}>
                    <div>
                        <div>Filter by Brand:</div>
                        <Checkbox.Group
                            onChange={this.handleCheckedChange}
                        >
                            {filterBy.map(filter => (
                                <Checkbox
                                    key={filter}
                                    label={filter}
                                    value={filter}
                                >
                                    {filter}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </div>
                    <div>
                        <div>Sort By: </div>
                        <Select
                            style={{ width: '15%' }}
                            defaultValue='Recently Added'
                            onChange={this.handleSortChange}
                        >
                            {sortBy.map(sort => (
                                <Option key={sort.name} value={sort.sort}>{sort.name}</Option>
                            ))}
                        </Select>
                    </div>
                </header>
                <div>
                    <ShowAddNewModal deptPassed={this.props.deptPassed} />
                    {productsDB.map((items) =>
                        <div style={cardSpacing} key={items.key}>
                            <Card
                                style={cardStyle}
                                title={items.productName}
                                key={items.key}
                                extra={
                                    <div className={'UpdateButtons'}>
                                        <ShowUpdateModal itemPassed={items} deptPassed={this.props.deptPassed} />
                                        <ShowDuplicateModal itemPassed={items} deptPassed={this.props.deptPassed} />
                                        <ShowDeleteModal itemPassed={items} deptPassed={this.props.deptPassed} />
                                    </div>
                                }
                            >
                                <Row>
                                    <Col flex={1}>
                                        <img src={items.imageUrl} alt='' width="350" />
                                    </Col>
                                    <Col flex={2}>
                                        <div>Series: {items.productSeries}</div>
                                        <div>Brand: {items.productBrand}</div>
                                        <div>Model# {items.productModelNumber}</div>
                                        <div>Material: {items.productMaterial}</div>
                                        <div>Size: {items.productSize}</div>
                                        <div>Color: {items.productColor}</div>
                                        <div>Made in: {items.productMadeIn}</div>
                                        {items.productDescription.split('\n').map((desc) => {
                                            return (
                                                <div key={desc} style={{ display: 'flex', flexDirection: 'row' }}>
                                                    <div>{`\u2022`}{`\u2008`}</div>
                                                    <div>{desc} </div>
                                                </div>
                                            )
                                        })}
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    )}
                </div >
            </div>
        )
    }
}

const styles = {
    cardSpacing: {
        paddingTop: 30,
    },
    cardStyle: {
        width: 400,
    }

}
export default UpdateDB;