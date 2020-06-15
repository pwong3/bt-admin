import React, { Component } from 'react';
import { Spin, Card, Select, Checkbox, List } from 'antd';
import ShowUpdateModal from '../Helpers/ShowUpdateModal';
import ShowDeleteModal from '../Helpers/ShowDeleteModal';
import ShowDuplicateModal from '../Helpers/ShowDuplicateModal';
import fire from '../config/fire';
import './UpdateDB.css';
import { LoadingOutlined } from '@ant-design/icons';

const rootRef = fire.database().ref()
const deptRootRef = rootRef.child('Department');
const sortBy = [
    { name: 'Product Name', sort: 'productName' },
    { name: 'Product Model #', sort: 'productModelNumber' },
    { name: 'Product Size', sort: 'productSize' },
    { name: 'Product Color', sort: 'productColor' },
    { name: 'Recently Added', sort: '' }
]
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

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
            filtering: false,
            isLoaded: false
        };
    }

    componentDidMount() {
        const deptPassed = this.props.deptPassed;
        const deptRef = deptRootRef.child(deptPassed).orderByChild('sortKey');
        deptRef.on('value', (childSnapshot) => {
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
                    isLoaded: true
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
            (sortByKey === '' ?
                productsList
                :
                this.sortByName(sortByKey, copyList)
            )
            :
            (sortByKey === '' ?
                filteredProductsList
                :
                this.sortByName(sortByKey, filteredProductsList)
            )
        //this.sortByName(sortByKey);

        return (
            <div >
                <div className={'Selections'}>
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
                            style={{ width: '150px' }}
                            defaultValue='Recently Added'
                            onChange={this.handleSortChange}
                        >
                            {sortBy.map(sort => (
                                <Option key={sort.name} value={sort.sort}>{sort.name}</Option>
                            ))}
                        </Select>
                    </div>
                </div>
                <div>
                    <br />
                    {this.state.isLoaded ?
                        (<List
                            grid={{
                                gutter: 16,
                                xs: 1,
                                sm: 2,
                                md: 3,
                                lg: 3,
                                xl: 4,
                                xxl: 4,
                            }}
                            dataSource={productsDB}
                            renderItem={items => (
                                <List.Item>
                                    <Card
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
                                        <div>
                                            {items.imageUrl.split('/8/8/8/').map((image => (
                                                <img
                                                    className={'Image'}
                                                    src={image}
                                                    alt={image}
                                                    key={image}
                                                />
                                            )))}

                                            <div>Series: {items.productSeries}</div>
                                            <div>Brand: {items.productBrand}</div>
                                            <div>Model# {items.productModelNumber}</div>
                                            <div>Material: {items.productMaterial}</div>
                                            <div>Size: {items.productSize}</div>
                                            <div>Color: {items.productColor}</div>
                                            <div>Made in: {items.productMadeIn}</div>
                                            {items.productDescription.split('\n').map((desc) => {
                                                if (desc.includes('//h//')) {
                                                    const header = desc.split('//h//')
                                                    return (
                                                        <div
                                                            key={desc}
                                                            style={{ fontWeight: 'bold' }}
                                                        >
                                                            {header[1]}
                                                        </div>)
                                                }
                                                else if (desc.includes('//p//')) {
                                                    const paragraph = desc.split('//p//')
                                                    return (
                                                        <div key={desc}>
                                                            {paragraph[1]}
                                                        </div>)
                                                }
                                                else
                                                    return (
                                                        <div key={desc} style={{ display: 'flex', flexDirection: 'row' }}>
                                                            <div>{`\u2022`}{`\u2008`}</div>
                                                            <div>{desc} </div>
                                                        </div>
                                                    )
                                            })}
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />)
                        :
                        <div style={{ textAlign: 'center' }}>
                            <Spin indicator={antIcon} />
                        </div>}
                </div >
            </div >
        )
    }
}

export default UpdateDB;