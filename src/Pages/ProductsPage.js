import React from 'react';
import ProductsList from '../Components/ProductsList';

function ProductsPage() {
    return (
        <div>
            <ProductsList deptPassed={'Faucets'}/>
            <ProductsList deptPassed={'Tiles'}/>
        </div>
    )
}

export default ProductsPage;