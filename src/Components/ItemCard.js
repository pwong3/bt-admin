import React, { PureComponent } from 'react';
import { Card } from 'antd';
import ShowUpdateModal from '../Helpers/ShowUpdateModal';
import ShowDeleteModal from '../Helpers/ShowDeleteModal';
import ShowCopyModal from '../Helpers/ShowCopyModal';

class ItemCard extends PureComponent {
    render() {
        const items = this.props.itemPassed;
        const deptPassed = this.props.deptPassed;
        return (
            <Card
                title={items.productName}
                key={items.key}
                extra={
                    <div className={'UpdateButtons'}>
                        <ShowUpdateModal itemPassed={items} deptPassed={deptPassed} />
                        <ShowCopyModal itemPassed={items} deptPassed={deptPassed} />
                        <ShowDeleteModal itemPassed={items} deptPassed={deptPassed} />
                    </div>
                }
            >
                <div>
                    {items.imageUrl.map((image => (
                        <img
                            key={image.name}
                            className={'Image'}
                            src={image.url}
                            alt={image.name}
                        />
                    )))}
                    <div>Series: {items.productSeries}</div>
                    <div>Brand: {items.productBrand}</div>
                    <div>Model# {items.productModelNumber}</div>
                    <div>Material: {items.productMaterial}</div>
                    <div>Size: {items.productSize}</div>
                    <div>Product Width: {items.productWidth}</div>
                    <div>Product Length/Depth: {items.productLength}</div>
                    <div>Color: {items.productColor}</div>
                    <div>Made in: {items.productMadeIn}</div>
                    <div>Search keywords: {items.searchKeywords}</div>
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
                                    {/*2022 bulletpoint 2008 space */}
                                    <div>{`\u2022`}{`\u2008`}</div> 
                                    <div>{desc} </div>
                                </div>
                            )
                    })}
                </div>
            </Card>
        )
    }
}

export default ItemCard;