import React, { Component } from 'react';
import { Card, CardContent } from '@material-ui/core';
import fire from '../config/fire';

const depts =
    [
        'Kitchen Sinks',
        'Tiles',
        'Bath Vanities',
        'Faucets',
        'Toilets',
        'Kitchen Cabinets'
    ];
class ProductsList extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            productsList: [],
        });
    }

    componentDidMount() {
        const deptPassed = this.props.deptPassed;
        //const prodPassed = this.props.navigation.getParam('prodPassed', 'dept');//passing the dept name to the pull correct database
        //console.log(prodPassed);//prodPassed equals name of dept
        const rootRef = fire.database().ref();
        const deptRef = rootRef.child('Department');
        const productRef = deptRef.child(deptPassed).orderByChild('sortKey').limitToLast(5);
        productRef.on('value', (childSnapshot) => {
            const products = [];
            childSnapshot.forEach((product) => {
                products.push({
                    key: product.key,
                    productName: product.toJSON().productName,
                    productMaterial: product.toJSON().productMaterial,
                    //      tilePrice: tile.toJSON().tilePrice,
                    productMadeIn: product.toJSON().productMadeIn,
                    productSize: product.toJSON().productSize,
                    imageUrl: product.toJSON().imageUrl,
                });
                //use this to show newest first
                //this.products = products.reverse();
                this.setState({
                    productsList: products,
                });
            });
        });


    }

    render() {
        const productsDB = this.state.productsList;
        //console.log(productsDB);
        return (
            <div>
                {productsDB.map((items) => {
                    return (
                        <Card variant="outlined" className="Card" key={items.key}>
                            <CardContent>
                                <img src={items.imageUrl} alt="" width="200" height="auto" />
                                <div>{items.productName}</div>
                                <div>{items.productMaterial}</div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        )
    }
}

export default ProductsList;