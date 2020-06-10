import React, { Component } from 'react';
import { Input, Button, Space, Progress } from 'antd';

class UploadImageInput extends Component {
    render() {
        return (
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
        )
    }
}

export default UploadImageInput;