import React, { Component } from 'react';
import { Form, Alert, Upload, Button, Icon, message } from 'antd';
import styles from './uploadOld.less';
import { uploadPackageOld } from '@services/workorder/implement';
class UploadPackageOld extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fileList:[]
        }
    }

    reset = () => {
        this.setState({ fileList:[] })
    }
    
    getDom = () => {
        const { orderId, fileType, getDetail } = this.props
        const props = {
            name: 'file',
            action: uploadPackageOld.action,
            data: {
                orderId,
                fileType,
            },
            beforeUpload:(file) => {
                console.log('file',file)
                const { name } = file
                const nameArr = name.split('.')
                const rightName = nameArr.length>0?nameArr[nameArr.length-1]:''
                if(rightName != 'exe' && rightName != 'zip') {
                    message.error('安装包格式错误');
                    return false;
                }
            },
            onChange:(info) => {
                this.setState({ fileList:[ info.file ] });
                if (info.file.status === 'done') {
                    const { response } = info.file
                    if(response.success) {
                        message.success(`${info.file.name} 上传成功`)
                        getDetail()
                    } else {
                        const { errorMessage = '' } = response
                        message.error(`${info.file.name}上传失败： ${errorMessage}`);
                    }
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传异常`);
                }
            },
        };
        return (
            <Upload {...props} fileList={this.state.fileList}>
                <Button type="primary">
                    <Icon type="upload" /> 上传
                </Button>
            </Upload>
        )
    }

    render() {
        return (
            <div>
                <Form className={styles.form}>
                    { this.getDom() }
                </Form>
                <Alert
                    className={ styles.alert }
                    message="注意事项"
                    description={
                    <ul className={ styles.ul }>
                        <li> 只能上传.exe/.zip 格式文件</li>
                    </ul> }
                    type="info"
                    showIcon
                    />
                    
            </div>
        )
    }
}

export default UploadPackageOld
