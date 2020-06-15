import React, { Component } from 'react';
import {
    Modal,
    Button
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import fire from '../config/fire';

const { confirm } = Modal;
const storage = fire.storage();

class ShowDeleteConfirm extends Component {
    constructor(props) {
        super(props);
        this.showDeleteModal = this.showDeleteModal.bind(this);
        this.showNoImageDeleteModal = this.showNoImageDeleteModal.bind(this);
    }
    showNoImageDeleteModal = (item) => {
        const rootRef = fire.database().ref();
        const deptRef = rootRef.child('Department');
        const productRef = deptRef.child(this.props.deptPassed);

        confirm({
            title: 'Are you sure you want to delete this product?',
            icon: <ExclamationCircleOutlined />,
            content: <p>{item.productName}</p>,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                productRef.child(item.key).remove();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    showDeleteModal = (item) => {
        const rootRef = fire.database().ref();
        const deptRef = rootRef.child('Department');
        const productRef = deptRef.child(this.props.deptPassed);
        const deleteRef = storage.refFromURL(this.props.itemPassed.imageUrl);

        confirm({
            title: 'Are you sure you want to delete this product?',
            icon: <ExclamationCircleOutlined />,
            content: <p>{item.productName}</p>,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                productRef.child(item.key).remove();
                deleteRef.delete();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    render() {
        const item = this.props.itemPassed;
        return (
            item.imageUrl === '' ?
                (<div>
                    <Button
                        style={{ margin: 2, width: 95 }}
                        danger
                        onClick={() => { this.showNoImageDeleteModal(item) }}
                    >
                        Delete
                    </Button>
                </div>)
                :
                (<div>
                    <Button
                        style={{ margin: 2, width: 95 }}
                        danger
                        onClick={() => { this.showDeleteModal(item) }}
                    >
                        Delete
                    </Button>
                </div>)
        )
    }
}

export default ShowDeleteConfirm;