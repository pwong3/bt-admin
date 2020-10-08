import React, { Component } from 'react';
import {
    Input,
    Modal,
    Button,
    message,
    Space,
} from 'antd';
import fire from '../config/fire';
import AddImage from '../Components/AddImage';
import noImage from '../noImage.png';

const rootRef = fire.database().ref();
const deptRef = rootRef.child('Department');
const storage = fire.storage();

class ShowAddNewModal extends Component {

    constructor(props) {
        super(props);
        this.addOnPress = this.addOnPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setProgress = this.setProgress.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
        this.fileHandleChange = this.fileHandleChange.bind(this);
        this.fileHandleUpload = this.fileHandleUpload.bind(this);
        this.clearInput = this.clearInput.bind(this);
        this.state = {
            sortKey: '',
            newProductSeries: '',
            newProductBrand: '',
            newProductName: '',
            newProductModelNumber: '',
            newProductMaterial: '',
            newProductMadeIn: '',
            newProductSize: '',
            newProductWidth: '',
            newProductLength: '',
            newProductColor: '',
            newProductDescription: '',
            newSearchKeywords: '',
            newImageUrlArray: [
                {
                    url: noImage,
                    name: 'noImage'
                }
            ],
            imageFile: '',
            inputKey: Date.now(),
            loading: false,
            visible: false,
            progressValue: 0
        };
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    fileHandleChange = (e) => {
        this.setState({ imageFile: e.target.files[0] });
    }
    setProgress = (progress) => {
        this.setState({ progressValue: progress });
    }
    deleteImage = (deleteIndex) => {
        if (this.state.newImageUrlArray.length === 1) {
            message.info('Please upload another image before deleting this one.')
            return
        }
        if (this.state.newImageUrlArray[deleteIndex].url === noImage) {
            const copy = [...this.state.newImageUrlArray]
            copy.splice(deleteIndex, 1)
            this.setState({
                newImageUrlArray: copy,
            })
        }
        else {
            const copy = [...this.state.newImageUrlArray]
            copy.splice(deleteIndex, 1)
            const deleteRef = storage.refFromURL(this.state.newImageUrlArray[deleteIndex].url);
            deleteRef.delete()
                .then(
                    this.setState({
                        newImageUrlArray: copy,
                        progressValue: 0
                    }))
        }
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
                        this.setState({
                            newImageUrlArray: [...this.state.newImageUrlArray, { url: url, name: this.state.imageFile.name }],
                            progressValue: 0,
                            inputKey: Date.now(),
                        })
                    })
            }
        )
    }
    addOnPress = () => {
        //if (this.state.newImageUrlArray.length === 0) {
        //    message.info('Please add an image first.')
        //   return
        // }
        try {
            const productRef = deptRef.child(this.props.deptPassed);
            productRef.push({
                sortKey: -1 * Date.now(),
                productSeries: this.state.newProductSeries,
                productBrand: this.state.newProductBrand,
                productName: this.state.newProductName,
                productModelNumber: this.state.newProductModelNumber,
                productMaterial: this.state.newProductMaterial,
                productMadeIn: this.state.newProductMadeIn,
                productSize: this.state.newProductSize,
                productWidth: this.state.newProductWidth === '' ? '' : parseFloat(this.state.newProductWidth),
                productLength: this.state.newProductLength === '' ? '' : parseFloat(this.state.newProductLength),
                productColor: this.state.newProductColor,
                productDescription: this.state.newProductDescription,
                productDepartment: this.props.deptPassed,
                imageUrl: this.state.newImageUrlArray,
                searchKeywords: this.state.newSearchKeywords,
            })
            this.setState({ visible: false });
            message.success([this.state.newProductName] + ' has been added.');
            this.clearInput();
        } catch {
            message.error('Please select department first.')
        }
    }
    clearInput = () => {
        this.setState({
            sortKey: '',
            newProductSeries: '',
            newProductBrand: '',
            newProductName: '',
            newProductModelNumber: '',
            newProductMaterial: '',
            newProductMadeIn: '',
            newProductSize: '',
            newProductWidth: '',
            newProductLength: '',
            newProductColor: '',
            newProductDescription: '',
            newSearchKeywords: '',
            newImageUrlArray: [
                {
                    url: noImage,
                    name: ''
                }
            ],
            imageFile: null,
            inputKey: Date.now(),
            progressValue: 0
        })
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
        this.clearInput();
        //this.deleteImage();
    };
    render() {
        const { TextArea } = Input;
        return (
            <div >
                <br />
                <Button
                    type='primary'
                    ghost
                    onClick={() => { this.showModal() }}
                >
                    Add New Product
                </Button>
                <Modal
                    title='To add new product, please enter desired fields.'
                    visible={this.state.visible}
                    okText='Add'
                    okType='primary'
                    cancelText='Cancel'
                    onOk={this.addOnPress}
                    onCancel={this.hideModal}
                >
                    {this.state.newImageUrlArray.length === 0 ?
                        <div>
                            <AddImage
                                fileHandleChange={this.fileHandleChange}
                                fileHandleUpload={this.fileHandleUpload}
                                percent={this.state.progressValue}
                                inputKey={this.state.inputKey}
                            />
                        </div>
                        :
                        <div>
                            {this.state.newImageUrlArray.map((newImage, index) => (
                                <Space key={index} >
                                    <div style={{ flexDirection: 'column' }}>
                                        <img src={newImage.url} alt={newImage.name} height='50' />
                                        <p>{newImage.name}</p>
                                    </div>
                                    <Button danger onClick={() => this.deleteImage(index)}>Delete Image</Button>
                                </Space>
                            ))}
                            <AddImage
                                fileHandleChange={this.fileHandleChange}
                                fileHandleUpload={this.fileHandleUpload}
                                percent={this.state.progressValue}
                                inputKey={this.state.inputKey}
                            />
                        </div>
                    }
                    <Input
                        placeholder='Product Series'
                        type='text'
                        name='newProductSeries'
                        size='medium'
                        value={this.state.newProductSeries}
                        onChange={this.handleChange}
                    />
                    <Input
                        placeholder='Product Brand'
                        type='text'
                        name='newProductBrand'
                        size='medium'
                        value={this.state.newProductBrand}
                        onChange={this.handleChange}
                    />
                    <Input
                        placeholder='Product Name'
                        type='text'
                        name='newProductName'
                        size='medium'
                        value={this.state.newProductName}
                        onChange={this.handleChange}
                    />
                    <Input
                        placeholder='Product Model Number'
                        type='text'
                        name='newProductModelNumber'
                        size='medium'
                        value={this.state.newProductModelNumber}
                        onChange={this.handleChange}
                    />
                    <Input
                        placeholder='Product Material'
                        type='text'
                        name='newProductMaterial'
                        size='medium'
                        value={this.state.newProductMaterial}
                        onChange={this.handleChange}
                    />
                    <Input
                        placeholder='Product Size'
                        type='text'
                        name='newProductSize'
                        size='medium'
                        value={this.state.newProductSize}
                        onChange={this.handleChange}
                    />
                    <Input
                        placeholder='Product Width (numbers 0-9 only)'
                        type='text'
                        name='newProductWidth'
                        size='medium'
                        value={this.state.newProductWidth}
                        onChange={this.handleChange}
                    />
                    <Input
                        placeholder='Product Length/Depth (numbers 0-9 only)'
                        type='text'
                        name='newProductLength'
                        size='medium'
                        value={this.state.newProductLength}
                        onChange={this.handleChange}
                    />
                    <Input
                        placeholder='Product Color'
                        type='text'
                        name='newProductColor'
                        size='medium'
                        value={this.state.newProductColor}
                        onChange={this.handleChange}
                    />
                    <Input
                        placeholder='Product Made In'
                        type='text'
                        name='newProductMadeIn'
                        size='medium'
                        value={this.state.newProductMadeIn}
                        onChange={this.handleChange}
                    />
                    <Input
                        placeholder={'Search Keywords'}
                        type='text'
                        name='newSearchKeywords'
                        size='medium'
                        value={this.state.newSearchKeywords}
                        onChange={this.handleChange}
                    />
                    <TextArea
                        rows={6}
                        placeholder={'Product Description'}
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

export default ShowAddNewModal;