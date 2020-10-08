import React, { PureComponent } from 'react';
import { Spin, Select, Checkbox, List, Button, Input, message } from 'antd';
import fire from '../config/fire';
import './UpdateDB.css';
import { LoadingOutlined } from '@ant-design/icons';
import ItemCard from '../Components/ItemCard'

const rootRef = fire.database().ref()
const deptRef = rootRef.child('Department');
const sortByDropDownList = [
    { name: 'Product Brand', property: 'productBrand' },
    { name: 'Product Name', property: 'productName' },
    { name: 'Product Model #', property: 'productModelNumber' },
    { name: 'Product Size', property: 'productWidth' },
    { name: 'Product Color', property: 'productColor' },
    { name: 'Recently Added', property: '' }
]
const antIcon = <LoadingOutlined style={{ fontSize: 40, color: 'red' }} spin />;

class UpdateDB extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.handleCheckedChange = this.handleCheckedChange.bind(this);
        this.filterByBrand = this.filterByBrand.bind(this);
        this.sortByName = this.sortByName.bind(this);

        this.state = {
            productsList: [],
            filteredProductsList: [],
            searchedProductsList: [],
            sortedProductsList: [],
            searchValue: '',
            sortByProperty: '',
            filterByKey: [],
            searching: false,
            sorting: false,
            filtering: false,
            isLoading: true,
            loadingMore: false,
            lastLoadedItem: '',
            moreToLoad: true
        };
    }

    loadData() {
        const deptPassed = this.props.deptPassed;
        const productRef = deptRef.child(deptPassed)
            .orderByChild('sortKey')
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
                    productMadeIn: product.val().productMadeIn,
                    productSize: product.val().productSize,
                    productWidth: product.val().productWidth,
                    productLength: product.val().productLength,
                    productColor: product.val().productColor,
                    productDescription: product.val().productDescription,
                    productDepartment: product.val().productDepartment,
                    imageUrl: product.val().imageUrl,
                    searchKeywords: product.val().searchKeywords,
                });
                this.setState({
                    productsList: products,
                    isLoading: false,
                    lastLoadedItem: product.val().sortKey
                });
            });
        });
    }

    componentDidMount() {
        this.loadData();
    }

    handleSearchChange = (e) => {
        if (this.state.searchValue === '') {
            this.setState({
                searching: false,
            })
        }
        this.setState({
            [e.target.name]: e.target.value,
            searching: true,
            searchedProductsList: []
        },
            () => this.filterBySearch()
        )
    }
    handleSortChange = (value) => {
        this.setState({ sortByProperty: value })
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
    filterBySearch = () => {
        const { productsList } = this.state;
        const copyProdList = productsList;
        const searchList = copyProdList.filter(prod => prod.productName.toLowerCase().includes(this.state.searchValue.toLowerCase()))
        this.setState({ searchedProductsList: searchList })
    }
    filterByBrand = () => {
        const { filterByKey, productsList, searching, searchedProductsList } = this.state;
        const tempProdList = [];
        searching === true ?
            filterByKey.forEach((filter) => {
                const eachFilterProdList = searchedProductsList.filter(prod => prod.productBrand === filter);
                eachFilterProdList.forEach((item) =>
                    tempProdList.push(item)
                )
            })
            :
            filterByKey.forEach((filter) => {
                const eachFilterProdList = productsList.filter(prod => prod.productBrand === filter);
                eachFilterProdList.forEach((item) =>
                    tempProdList.push(item)
                )
            })
        this.setState({ filteredProductsList: tempProdList })
    }
    //sort by dropdown
    sortByName = (sortProperty, list) => {
        if (sortProperty === 'productWidth') {
            return list.sort((a, b) =>
                (a[sortProperty] > b[sortProperty]) ? 1 : -1)
        } else {
            return list.sort((a, b) =>
                (a[sortProperty].toLowerCase() > b[sortProperty].toLowerCase()) ? 1 : -1)
        }
    }

    //used to add productWidth and productLength to existing products
    updateDatabase = () => {
        const db = this.state.productsList;
        const productRef = deptRef.child(this.props.deptPassed);
        db.forEach((item) => {
            let keywords = '';
            console.log(item.productBrand.toLowerCase())
            keywords = keywords.concat(item.productBrand.toLowerCase())
                .concat(', ', item.productDepartment.toLowerCase())
                .concat(', ', item.productMaterial.toLowerCase())
                .concat(', ', item.productColor.toLowerCase())
                .concat(', ', item.productModelNumber.toLowerCase())
            console.log(keywords)
            productRef.child(item.key).update({
                searchKeywords: keywords,
            })

            message.success(item.productName + 'updated')
        })
    }

    render() {
        const { Option } = Select;
        const {
            productsList,
            filtering,
            sortByProperty,
            filteredProductsList,
            searching,
            searchedProductsList,
        } = this.state;
        const copyProductsList = [...productsList]//clones array
        const copySearchedList = [...searchedProductsList]
        //get all unique brands
        const filterByBrandList = searching === true ?
            [...new Set(searchedProductsList.map(prod => prod.productBrand))].sort((a, b) =>
                (a.toLowerCase() > b.toLowerCase()) ? 1 : -1)
            :
            [...new Set(productsList.map(prod => prod.productBrand))].sort((a, b) =>
                (a.toLowerCase() > b.toLowerCase()) ? 1 : -1)

        const productsDB = searching === true ?
            //search true
            (filtering === false ?
                //sortByName is using copyList so the filter checkboxes don't move when sorting
                (sortByProperty === '' ?
                    searchedProductsList
                    :
                    this.sortByName(sortByProperty, copySearchedList)
                )
                :
                (sortByProperty === '' ?
                    filteredProductsList
                    :
                    this.sortByName(sortByProperty, filteredProductsList)
                )
            )
            :
            //search false
            (filtering === false ?
                //sortByName is using copyList so the filter checkboxes don't move when sorting
                (sortByProperty === '' ?
                    productsList
                    :
                    this.sortByName(sortByProperty, copyProductsList)
                )
                :
                (sortByProperty === '' ?
                    filteredProductsList
                    :
                    this.sortByName(sortByProperty, filteredProductsList)
                )
            )
        return (
            <div >
                <div>
                    <div style={{ marginTop: 15 }}>Search</div>
                    <Input
                        style={{ width: 321, }}
                        name='searchValue'
                        type='text'
                        placeholder='Enter name of product'
                        onChange={this.handleSearchChange}
                        value={this.state.searchValue}
                    />
                </div>
                <div className={'Selections'}>
                    <div>
                        <div>Filter by Brand:</div>
                        <Checkbox.Group
                            onChange={this.handleCheckedChange}
                        >
                            {filterByBrandList.map(filter => (
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
                            {sortByDropDownList.map(sortBy => (
                                <Option key={sortBy.name} value={sortBy.property}>{sortBy.name}</Option>
                            ))}
                        </Select>
                    </div>
                </div>
                <div>
                    <br />
                    <div>
                        <Button
                            type='primary'
                            onClick={this.updateDatabase}>
                            update database
                        </Button>
                    </div>
                    {this.state.isLoading ?
                        <div style={{ textAlign: 'center' }}>
                            <Spin indicator={antIcon} />
                        </div>
                        :
                        (<div>
                            <List
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
                                        <ItemCard itemPassed={items} deptPassed={this.props.deptPassed} />
                                    </List.Item>
                                )}
                            />
                            {/* <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
                                {this.state.loadingMore ?
                                    <Spin indicator={antIcon} />
                                    :
                                    <Button onClick={() => this.loadMore()}>Load More</Button>
                                }
                            </div> */}
                        </div>
                        )
                    }
                </div >
            </div >
        )
    }
}

export default UpdateDB;