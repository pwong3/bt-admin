import React, { Component } from 'react';
import {
    Input,
    Modal,
    Button,
    Space,
    message,
    Progress
} from 'antd';
import fire from '../config/fire';

const rootRef = fire.database().ref();
const deptRef = rootRef.child('Department');
const storage = fire.storage();

class ShowUpdateModal extends Component {
    constructor(props) {
        super(props);
        this.updateOnPress = this.updateOnPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
        this.state = {
            newProductSeries: '',
            newProductBrand: '',
            newProductName: '',
            newProductModelNumber: '',
            newProductMaterial: '',
            newProductMadeIn: '',
            newProductSize: '',
            newProductColor: '',
            newProductDescription: '',
            newImageUrl: '',
            imageFile: '',
            loading: false,
            visible: false,
            progressValue: 0
        };
    }
    componentDidMount() {
        const currItem = this.props.itemPassed;
        this.setState({
            newProductSeries: currItem.productSeries,
            newProductBrand: currItem.productBrand,
            newProductName: currItem.productName,
            newProductModelNumber: currItem.productModelNumber,
            newProductMaterial: currItem.productMaterial,
            newProductSize: currItem.productSize,
            newProductColor: currItem.productColor,
            newProductMadeIn: currItem.productMadeIn,
            newProductDescription: currItem.productDescription,
            newImageUrl: currItem.imageUrl
        });
    }
    deleteImage = () => {
        const deleteRef = storage.refFromURL(this.props.itemPassed.imageUrl);
        const currItem = this.props.itemPassed;
        const productRef = deptRef.child(this.props.deptPassed);
        deleteRef.delete()
            .then(
                this.setState({ newImageUrl: '' }),
                this.setState({ progressValue: 0 }))
            .then(() =>
                productRef.child(currItem.key).update({
                    imageUrl: this.state.newImageUrl
                })
            );
    }
    fileHandleChange = (e) => {
        this.setState({ imageFile: e.target.files[0] });
    }
    setProgress = (progress) => {
        this.setState({ progressValue: progress });
    }
    fileHandleUpload = () => {
        if (this.state.imageFile === '') {
            message.info('Please select an image first.')
            return
        }
        const uploadTask = storage.ref(`${this.props.deptPassed}/` + this.state.imageFile.name).put(this.state.imageFile);
        uploadTask.on(
            'state_changed',
            snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                this.setProgress(progress);
            },
            error => {
                console.log(error);
            },
            () => {
                storage
                    .ref(`${this.props.deptPassed}`)
                    .child(this.state.imageFile.name)
                    .getDownloadURL()
                    .then(url => {
                        this.setState({ newImageUrl: url })
                    });
            }
        )
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    updateOnPress = () => {
        const currItem = this.props.itemPassed;
        const productRef = deptRef.child(this.props.deptPassed);
        productRef.child(currItem.key).update({
            productSeries: this.state.newProductSeries,
            productBrand: this.state.newProductBrand,
            productName: this.state.newProductName,
            productModelNumber: this.state.newProductModelNumber,
            productMaterial: this.state.newProductMaterial,
            productMadeIn: this.state.newProductMadeIn,
            productSize: this.state.newProductSize,
            productColor: this.state.newProductColor,
            productDescription: this.state.newProductDescription,
            imageUrl: this.state.newImageUrl
        })
        message.success([this.state.newProductName] + ' has been updated.')
        this.setState({ visible: false })
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    hideModal = () => {
        this.setState({
            visible: false,
        });
    };
    render() {
        const { TextArea } = Input;
        const currItem = this.props.itemPassed;
        return (
            <div>
                <Button
                    style={{ marginBottom: 5, width: 95}}
                    type='primary'
                    ghost
                    onClick={() => { this.showModal() }}
                >
                    Update
                </Button>
                <Modal
                    title='Make changes and hit update.'
                    visible={this.state.visible}
                    okText='Update'
                    okType='primary'
                    cancelText='Cancel'
                    onOk={this.updateOnPress}
                    onCancel={this.hideModal}
                >
                    {currItem.imageUrl === '' ?
                        <Space>
                            <Input
                                type='file'
                                onChange={this.fileHandleChange}
                                key={this.state.inputKey}
                            >
                            </Input>
                            <Button onClick={this.fileHandleUpload}>Upload</Button>
                            <div style={{ width: 120 }}>
                                <Progress size='small' percent={this.state.progressValue} />
                            </div>
                        </Space>
                        :
                        <Space>
                            <img src={currItem.imageUrl} alt='' height='50' />
                            <Button danger onClick={this.deleteImage}>Delete Image</Button>
                        </Space>
                    }
                    <Input
                        placeholder={'Product Series: ' + currItem.productSeries}
                        type='text'
                        name='newProductSeries'
                        size='medium'
                        value={this.state.newProductSeries}
                        onChange={this.handleChange}
                    />
                    <Input
                        placeholder={'Product Brand: ' + currItem.productBrand}
                        type='text'
                        name='newProductBrand'
                        size='medium'
                        value={this.state.newProductBrand}
                        onChange={this.handleChange}
                    />
                    <Input
                        placeholder={'Product Name: ' + currItem.productName}
                        type='text'
                        name='newProductName'
                        size='medium'
                        value={this.state.newProductName}
                        onChange={this.handleChange}
                    />
                    <Input
                        placeholder={'Model Number: ' + currItem.productModelNumber}
                        type='text'
                        name='newProductModelNumber'
                        size='medium'
                        value={this.state.newProductModelNumber}
                        onChange={this.handleChange}
                    />
                    <Input
                        placeholder={'Material: ' + currItem.productMaterial}
                        type='text'
                        name='newProductMaterial'
                        size='medium'
                        value={this.state.newProductMaterial}
                        onChange={this.handleChange}
                    />
                    <Input
                        placeholder={'Size: ' + currItem.productSize}
                        type='text'
                        name='newProductSize'
                        size='medium'
                        value={this.state.newProductSize}
                        onChange={this.handleChange}
                    />
                    <Input
                        placeholder={'Color: ' + currItem.productColor}
                        type='text'
                        name='newProductColor'
                        size='medium'
                        value={this.state.newProductColor}
                        onChange={this.handleChange}
                    />
                    <Input
                        placeholder={'Made in: ' + currItem.productMadeIn}
                        type='text'
                        name='newProductMadeIn'
                        size='medium'
                        value={this.state.newProductMadeIn}
                        onChange={this.handleChange}
                    />
                    <TextArea
                        rows={6}
                        placeholder={'Product Description' + currItem.productDescription}
                        type='text'
                        name='newProductDescription'
                        size='medium'
                        value={this.state.newProductDescription}
                        onChange={this.handleChange}
                    />
                </Modal>
            </div >
        )
    }
}

export default ShowUpdateModal;