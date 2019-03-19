import React, { Component } from 'react';
import { Form, Alert, Upload, Button, Icon, message } from 'antd';
import styles from './import.less';
import { importRelation } from '@services/enterprise/hotelOp/relation';
class ImportForm extends Component {
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
        const { fhHid, getAllHotelRelation } = this.props
        const props = {
            name: 'excel',
            action: importRelation.action,
            data: {
                fhHid,
            },
            onChange:(info) => {
                this.setState({ fileList:[ info.file ] });
                if (info.file.status === 'done') {
                    const { response } = info.file
                    if(response.success) {
                        message.success(`${info.file.name} 导入成功，共成功导入${response.data}条数据`)
                        getAllHotelRelation()
                    } else {
                        const retArr = [<span key={0} style={{'fontWeight':'bold'}}>{info.file.name} 导入失败</span>]
                        const resMsg = response.msg.toString().split(',')
                        resMsg.map((v,n)=>{
                            retArr.push(<p style={{'margin':'0px'}} key={n+1}>{ v }</p>)
                            if(n == resMsg.length-1) {
                                retArr.push(<span>导致全部失败，请修正后上传</span>)
                            }
                        })
                        message.error(retArr);
                    }
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传异常`);
                }
            },
        };
        return (
            <Upload {...props} fileList={this.state.fileList}>
                <Button type="primary">
                    <Icon type="upload" /> 导入数据
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
                        <li>1 只支持Excel格式</li>
                        <li>2 第一行为标题，第二行开始为数据</li>
                        <li>3 PMS房间号不允许为空</li>
                        <li>4 其他字段无需上传则为空</li>
                        <li>5 房间号支持中文、英文、数字，长度限制为20个字符</li>
                        <li>6 数据列从左到右依次为：PMS房间号、酒店房间号、房间位置、PSB房间号、门锁房间号</li>
                    </ul> }
                    type="info"
                    showIcon
                    />
                    
            </div>
        )
    }
}

export default ImportForm
