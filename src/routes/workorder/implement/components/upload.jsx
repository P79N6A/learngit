import React, { Component } from 'react';
import { Form, Alert, Upload, Button, Icon, message } from 'antd';
import styles from './upload.less';
import { uploadPackage } from '@services/workorder/implement';
class UploadPackage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fileList:[]
        }
    }

    reset = () => {
        this.setState({ fileList:[] })
    }
    
    /**
   * photo-实施工单照片
   * video-实施工单视频
   */
    getDom = () => {
        const { orderId, fileType, getDetail } = this.props
        console.log('fileType',fileType)
        const props = {
            name: 'file',
            action: uploadPackage.action,
            data: {
                orderId,
                fileType,
            },
            beforeUpload:(file) => {
                const photo2M = file.size / 1024 / 1024 < 2;
                const video20M = file.size / 1024 / 1024 < 20;
                if (fileType == 'photo' && !photo2M) {
                    message.error('图片大小应小于2M');
                    return false
                }
                if (fileType == 'video' && !video20M) {
                    message.error('视频大小应小于20M');
                    return false
                }
                return true;
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
                        <li> 图片大小须小于2M，最多上传4张</li>
                        <li> 视频大小须小于20M，最多上传2个</li>
                    </ul> }
                    type="info"
                    showIcon
                    />
                    
            </div>
        )
    }
}

export default UploadPackage
