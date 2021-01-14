import React, { PureComponent } from 'react';
import { Card, Divider } from 'antd';
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
                    <div><text style={{ fontWeight: 'bold' }}>Brand: </text>{items.productBrand}</div>
                    <div><text style={{ fontWeight: 'bold' }}>Series: </text>{items.productSeries}</div>
                    <div><text style={{ fontWeight: 'bold' }}>Model# </text>{items.productModelNumber}</div>
                    <div><text style={{ fontWeight: 'bold' }}>Material: </text>{items.productMaterial}</div>
                    <div><text style={{ fontWeight: 'bold' }}>Size: </text>{items.productSize}</div>
                    <div><text style={{ fontWeight: 'bold' }}>Product Width: </text>{items.productWidth}</div>
                    <div><text style={{ fontWeight: 'bold' }}>Product Length/Depth: </text>{items.productLength}</div>
                    <div><text style={{ fontWeight: 'bold' }}>Color: </text>{items.productColor}</div>
                    <div><text style={{ fontWeight: 'bold' }}>Made in: </text>{items.productMadeIn}</div>
                    <div><text style={{ fontWeight: 'bold' }}>Search keywords: </text>{items.searchKeywords}</div>

                    <Divider orientation='left'><text style={{ fontSize: 14, fontWeight: 'bold' }}>Product Description</text></Divider>
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