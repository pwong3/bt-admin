import React, { Component } from 'react';
import {
    Form,
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

class ShowCopyModal extends Component {

    constructor(props) {
        super(props);
        this.addOnPress = this.addOnPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setProgress = this.setProgress.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
        this.fileHandleChange = this.fileHandleChange.bind(this);
        this.fileHandleUpload = this.fileHandleUpload.bind(this);
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

    componentDidMount() {
        const currItem = this.props.itemPassed;
        this.setState({
            newProductSeries: currItem.productSeries,
            newProductBrand: currItem.productBrand,
            newProductName: currItem.productName,
            newProductModelNumber: currItem.productModelNumber,
            newProductMaterial: currItem.productMaterial,
            newProductSize: currItem.productSize,
            newProductWidth: currItem.productWidth,
            newProductLength: currItem.productLength,
            newProductColor: currItem.productColor,
            newProductMadeIn: currItem.productMadeIn,
            newProductDescription: currItem.productDescription,
            newSearchKeywords: '',
        });
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
                            inputKey: Date.now()
                        })
                    });
            }
        )
    }
    addOnPress = () => {
        // if (this.state.newImageUrlArray.length === 0) {
        //     message.info('Please add an image first.')
        //     return
        // }
        let keywords = ''
        if (this.props.deptPassed === 'Tiles') {
            keywords = keywords
                .concat(' ', this.state.newProductSeries.toLowerCase())
                .concat(' ', this.state.newProductName.toLowerCase())
                .concat(' ', this.state.newProductModelNumber.toLowerCase())
                .concat(' ', this.state.newProductMaterial.toLowerCase())
                .concat(' ', this.state.newProductColor.toLowerCase())
                .concat(' ', this.state.newProductSize.toLowerCase())
                .concat(' ', this.state.newProductWidth, 'x', this.state.newProductLength)
                .concat(' ', this.state.newProductColor.toLowerCase())
                .concat(' ', this.props.deptPassed.toLowerCase())
        } else {
            keywords = keywords
                .concat(' ', this.state.newProductBrand.toLowerCase())
                .concat(' ', this.state.newProductSeries.toLowerCase())
                .concat(' ', this.state.newProductName.toLowerCase())
                .concat(' ', this.state.newProductModelNumber.toLowerCase())
                .concat(' ', this.state.newProductMaterial.toLowerCase())
                .concat(' ', this.state.newProductColor.toLowerCase())
                .concat(' ', this.state.newProductSize.toLowerCase())
                .concat(' ', this.state.newProductWidth, 'x', this.state.newProductLength)
                .concat(' ', this.state.newProductColor.toLowerCase())
                .concat(' ', this.props.deptPassed.toLowerCase())
        }
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
                searchKeywords: keywords,
            })
            this.setState({ visible: false });
            message.success([this.state.newProductName] + ' has been added.');
        } catch {
            message.error('Please select a department first.')
        }
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
        return (
            <div >
                <Button
                    style={{ margin: 2, width: 95 }}
                    type='primary'
                    ghost
                    onClick={() => { this.showModal() }}
                >
                    Copy Item
                </Button>
                <Modal
                    title='To add new product, please enter in all fields.'
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
                    <br />
                    <Form
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        layout="horizontal"
                    >
                        <Form.Item label='Product Brand'>
                            <Input
                                placeholder='Product Brand'
                                type='text'
                                name='newProductBrand'
                                size='medium'
                                value={this.state.newProductBrand}
                                onChange={this.handleChange}
                            />
                        </Form.Item>
                        <Form.Item label='Product Series'>
                            <Input
                                placeholder='Product Series'
                                type='text'
                                name='newProductSeries'
                                size='medium'
                                value={this.state.newProductSeries}
                                onChange={this.handleChange}
                            />
                        </Form.Item>
                        <Form.Item label='Product Name'>
                            <Input
                                placeholder='Product Name'
                                type='text'
                                name='newProductName'
                                size='medium'
                                value={this.state.newProductName}
                                onChange={this.handleChange}
                            />
                        </Form.Item>
                        <Form.Item label='Product Model#'>
                            <Input
                                placeholder='Product Model Number'
                                type='text'
                                name='newProductModelNumber'
                                size='medium'
                                value={this.state.newProductModelNumber}
                                onChange={this.handleChange}
                            />
                        </Form.Item>
                        <Form.Item label='Product Material'>
                            <Input
                                placeholder='Product Material'
                                type='text'
                                name='newProductMaterial'
                                size='medium'
                                value={this.state.newProductMaterial}
                                onChange={this.handleChange}
                            />
                        </Form.Item>
                        <Form.Item label='Product Size'>
                            <Input
                                placeholder='Product Size'
                                type='text'
                                name='newProductSize'
                                size='medium'
                                value={this.state.newProductSize}
                                onChange={this.handleChange}
                            />
                        </Form.Item>
                        <Form.Item label='Product Width'>
                            <Input
                                placeholder='Product Width (numbers 0-9 only)'
                                type='text'
                                name='newProductWidth'
                                size='medium'
                                value={this.state.newProductWidth}
                                onChange={this.handleChange}
                            />
                        </Form.Item>
                        <Form.Item label='Product Length/Depth'>
                            <Input
                                placeholder='Product Length/Depth (numbers 0-9 only)'
                                type='text'
                                name='newProductLength'
                                size='medium'
                                value={this.state.newProductLength}
                                onChange={this.handleChange}
                            />
                        </Form.Item>
                        <Form.Item label='Product Color'>
                            <Input
                                placeholder='Product Color'
                                type='text'
                                name='newProductColor'
                                size='medium'
                                value={this.state.newProductColor}
                                onChange={this.handleChange}
                            />
                        </Form.Item>
                        <Form.Item label='Product Made In'>
                            <Input
                                placeholder='Product Made In'
                                type='text'
                                name='newProductMadeIn'
                                size='medium'
                                value={this.state.newProductMadeIn}
                                onChange={this.handleChange}
                            />
                        </Form.Item>
                        <Form.Item label='Search Keywords'>
                            <Input
                                placeholder={'Search Keywords'}
                                type='text'
                                name='newSearchKeywords'
                                size='medium'
                                value={this.state.newSearchKeywords}
                                onChange={this.handleChange}
                            />
                        </Form.Item>
                        <Form.Item label='Product Description'>
                            <TextArea
                                rows={6}
                                placeholder={'Product Description (must fill in)'}
                                type='text'
                                name='newProductDescription'
                                size='medium'
                                value={this.state.newProductDescription}
                                onChange={this.handleChange}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div >
        )
    }
}

export default ShowCopyModal;