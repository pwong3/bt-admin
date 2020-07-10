import React, { PureComponent } from 'react';
import { Spin, Select, Checkbox, List, Button, Input } from 'antd';
import fire from '../config/fire';
import './UpdateDB.css';
import { LoadingOutlined } from '@ant-design/icons';
import ItemCard from '../Components/ItemCard'

const rootRef = fire.database().ref()
const deptRootRef = rootRef.child('Department');
const sortByDropDownList = [
    { name: 'Product Brand', sort: 'productBrand' },
    { name: 'Product Name', sort: 'productName' },
    { name: 'Product Model #', sort: 'productModelNumber' },
    { name: 'Product Size', sort: 'productSize' },
    { name: 'Product Color', sort: 'productColor' },
    { name: 'Recently Added', sort: '' }
]
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

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
            sortByKey: '',
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
        const deptRef = deptRootRef.child(deptPassed)
            .orderByChild('sortKey')
        deptRef.on('value', (childSnapshot) => {
            const products = [];
            childSnapshot.forEach((product) => {
                products.push(product.val());
                this.setState({
                    productsList: products,
                    isLoading: false,
                    lastLoadedItem: product.val().sortKey
                });
            });
        });
    }
    loadMore() {
        this.setState({ loadingMore: true })
        const deptPassed = this.props.deptPassed;
        const deptRef = deptRootRef.child(deptPassed)
            .orderByChild('sortKey')
            .startAt(this.state.lastLoadedItem)
            .limitToFirst(41);
        deptRef.on('value', (childSnapshot) => {
            const products = this.state.productsList;
            products.pop();
            childSnapshot.forEach((product) => {
                products.push(product.val());
                this.setState({
                    productsList: products,
                    isLoading: false,
                    loadingMore: false,
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
    sortByName = (sort, list) => {
        const sortProdList = list;
        return sortProdList.sort((a, b) =>
            (a[sort].toLowerCase() > b[sort].toLowerCase()) ? 1 : -1)
    }
    render() {
        const { Option } = Select;
        const {
            productsList,
            filtering,
            sortByKey,
            filteredProductsList,
            searching,
            searchedProductsList,
            sortedProductsList
        } = this.state;
        const copyProductsList = [...productsList]
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
                (sortByKey === '' ?
                    searchedProductsList
                    :
                    this.sortByName(sortByKey, copySearchedList)
                )
                :
                (sortByKey === '' ?
                    filteredProductsList
                    :
                    this.sortByName(sortByKey, filteredProductsList)
                )
            )
            :
            //search false
            (filtering === false ?
                //sortByName is using copyList so the filter checkboxes don't move when sorting
                (sortByKey === '' ?
                    productsList
                    :
                    this.sortByName(sortByKey, copyProductsList)
                )
                :
                (sortByKey === '' ?
                    filteredProductsList
                    :
                    this.sortByName(sortByKey, filteredProductsList)
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
                            {sortByDropDownList.map(sort => (
                                <Option key={sort.name} value={sort.sort}>{sort.name}</Option>
                            ))}
                        </Select>
                    </div>
                </div>
                <div>
                    <br />
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
                                        <ItemCard items={items} deptPassed={this.props.deptPassed} />
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