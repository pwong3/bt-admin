import React, { Component } from 'react';
import {
    Input,
    Button,
    Space,
    Progress,
} from 'antd';

class AddImage extends Component {
    render() {
        return (
            <Space>
                <Input
                    type='file'
                    onChange={this.props.fileHandleChange}
                    key={this.props.inputKey}
                >
                </Input>
                <Button onClick={this.props.fileHandleUpload}>Upload</Button>
                <div style={{ width: 120 }}>
                    <Progress size='small' percent={this.props.percent} />
                </div>
            </Space>
        )
    }
}

export default AddImage;