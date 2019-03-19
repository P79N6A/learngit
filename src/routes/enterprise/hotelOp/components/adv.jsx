import React,{ Component } from 'react'
import { Divider, Radio, Form, Row, Col, Button, Input, Upload, Icon, message, Tooltip } from 'antd'
import styles from './adv.less'
import Modal from '@components/modal/modal'
import withRef from '@components/HOC/withRef/withRef'
import { hotelUpload } from '@services/enterprise/hotelOp/adv'
const TYPE_QRCODE = 3//二维码
const TYPE_IMGADV = 4//图片广告
const TYPE_FESTIVAL = 6//节日主题
const TYPE_NULL = -1//不选
let TOPTEXT = ''
let BOTTOMTEXT = ''
@withRef
export default class Adv extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fileList1:[],
            fileList2:[],
            fileList3:[],
            radioSe:null,
            topText:null,
            bottomText:null,
            nowSrc:null
        }
    }

    componentDidMount() {
    }

    initParam = (editHotel) => {
        const { advConfig } = editHotel
        if(!advConfig) return;
        const { type, qrCode, adImg } = advConfig
        if(type == 3) {
            this.setState({
                radioSe:1,
                fileList1:[
                    {
                        uid: '1',
                        name: qrCode.src,
                        status: 'done',
                        response:{
                            data:qrCode.src
                        },
                        url: qrCode.src,
                    }
                ],
                topText:qrCode.topText || '',
                bottomText:qrCode.bottomText || '',
                fileList2:[],
                fileList3:[],
                nowSrc:null
            })
        } else if(type == 4) {
            this.setState({
                radioSe:2,
                fileList2:[
                    {
                        uid: '2',
                        name: adImg.verticalSrc,
                        status: 'done',
                        response:{
                            data:adImg.verticalSrc
                        },
                        url: adImg.verticalSrc,
                    }
                ],
                fileList3:[
                    {
                        uid: '3',
                        name: adImg.horizontalSrc,
                        status: 'done',
                        response:{
                            data:adImg.horizontalSrc
                        },
                        url: adImg.horizontalSrc,
                    }
                ],
                fileList1:[],
                topText:null,
                bottomText:null,
                nowSrc:null
            })
        } else if(type == 6) {
            this.setState({ 
                radioSe:3,
                fileList1:[],
                fileList2:[],
                fileList3:[],
                topText:null, 
                bottomText:null,
                nowSrc:null
            })
        } else {
            this.setState({ 
                radioSe:4,
                fileList1:[],
                fileList2:[],
                fileList3:[],
                topText:null, 
                bottomText:null,
                nowSrc:null
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        this.initParam(nextProps.editHotel);
    }

    reset = () => {
        const editHotel = this.props.editHotel
        this.initParam(editHotel)
    }

    getUpload = (word,num) => {
        const tipArr = [
            '支持jpg/png图片，大小不超过1M，建议尺寸240*240',
            '支持jpg/png图片，大小不超过1M，建议尺寸720*420',
            '支持jpg/png图片，大小不超过1M，建议尺寸1000*360',
        ]
        const { fhHid } = this.props.editHotel
        const props = {
            name:'img',
            action: hotelUpload.action,
            data: {
                fhHid,
            },
            beforeUpload:(file) => {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                if (!isJPG && !isPNG) {
                    message.error('图片格式须为png或jpeg');
                }
                const isLt2M = file.size / 1024 / 1024 < 1;
                if (!isLt2M) {
                    message.error('图片大小须小于1M');
                }
                return (isJPG || isPNG) && isLt2M;
            },
            onChange:(info) => {
                this.setState({ ['fileList'+num]:[ info.file ] });
                if (info.file.status === 'done') {
                    const { response } = info.file
                    if(response.success) {
                        message.success(`${info.file.name} 上传成功`)
                    } else {
                        message.error(`${info.file.name} 上传失败`);
                    }
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传异常`);
                }
            },
            onRemove:(file) => {
                this.setState({ ['fileList'+num]:[] });
            },
            onPreview:(file) => {
                const titleImg = (file && file.response && file.response.data) || null;
                console.log(file)
                titleImg && this.setState({ nowSrc: titleImg},() => {
                    this.modalPic.changeVisible(true)
                })
            }
        };
        return (
            <Upload {...props} defaultFileList= {this.state[`fileList${num}`]} fileList={this.state[`fileList${num}`]}>
                <Tooltip placement="rightTop" title={ tipArr[num-1] }>
                    <Button type="primary">
                        <Icon type="upload" /> {word}
                    </Button>
                </Tooltip>
            </Upload>
        )
    }


    doCancle_ = () => {
        const { doCancle } = this.props
        doCancle()
    }

    radioChange = (radioSe) => {
        this.setState({ radioSe })
    }

    // 根据单选框输入 决定单选框展示
    getChecked = (num) => {
        const radioSe = this.state.radioSe;
        if(!radioSe) {
            return false;
        }

        if(num == 1 && radioSe != 1) {
            return false
        } else if(num == 1 && radioSe == 1) {
            return true
        }
        if(num == 2 && radioSe != 2) {
            return false
        } else if(num == 2 && radioSe == 2) {
            return true
        }
        if(num == 3 && radioSe != 3) {
            return false
        } else if(num == 3 && radioSe == 3) {
            return true
        }
        if(num == 4 && radioSe != 4) {
            return false
        } else if(num == 4 && radioSe == 4) {
            return true
        }
    }

    getWord1 = () => {
        if(this.state.topText) {
            return this.state.topText
        }
    }
    getWord2 = () => {
        if(this.state.bottomText) {
            return this.state.bottomText
        }
    }
    changeWord1 = (e) => {
        if(e.target.value.length > 12) {
            this.setState({ topText:TOPTEXT })
        } else {
            TOPTEXT = e.target.value
            this.setState({ topText:e.target.value })
        }
    }
    changeWord2 = (e) => {
        if(e.target.value.length > 15) {
            this.setState({ bottomText:BOTTOMTEXT })
        } else {
            BOTTOMTEXT = e.target.value
            this.setState({ bottomText:e.target.value })
        }
    }

    handleSubmit = (e) => {
        const { update } = this.props
        const { radioSe, topText, bottomText, fileList1, fileList2, fileList3 } = this.state
        if(radioSe == 1) {//二维码
            update({
                type:TYPE_QRCODE,
                qrCode:{
                    src:(fileList1.length>0 && fileList1[0].response && fileList1[0].response.data) || '',
                    topText:topText || '',
                    bottomText:bottomText || '',
                }
            })
        } else if(radioSe == 2) {//图片广告
            update({
                type:TYPE_IMGADV,
                adImg:{
                    verticalSrc:(fileList2.length>0 && fileList2[0].response && fileList2[0].response.data) || '',
                    horizontalSrc:(fileList3.length>0 && fileList3[0].response && fileList3[0].response.data) || '',
                }
            })
        } else if(radioSe == 3) {//节日主题
            update({
                type:TYPE_FESTIVAL,
            })
        } else {//都不选
            update({
                type:TYPE_NULL,
            })
        }
    }

    render() {
        const { fileList1, nowSrc } = this.state;
        const titleImg = (fileList1.length>0 && fileList1[0].response && fileList1[0].response.data) || null;
        return (
            <div>
                <h3>首页广告</h3>
                <Divider />
                <Row style={{ marginTop:'10px' }} type="flex" align="middle" gutter={ 2 }>
                    <Col key={1} span={ 2 } offset={2}>
                        <Radio checked={ this.getChecked(1) } onChange={ this.radioChange.bind(this,1) }>二维码</Radio>
                    </Col>
                    <Col className={ styles.right } key={2} span={ 2 }>
                        <label className={ styles.label }>图片：</label>
                    </Col>
                    <Col key={3} span={ 16 }>
                        { this.getUpload('重新上传',1) }
                    </Col>
                </Row>
                <Row style={{ marginTop:'10px' }}>
                    <Col className={ styles.right } key={1} span={ 2 } offset={4}>
                        <label className={ styles.label }>文案1：</label>
                    </Col>
                    <Col key={2} span={ 8 }>
                        <Input value={ this.getWord1() } onChange={ this.changeWord1 } placeholder="不超过12个字" />
                    </Col>
                </Row>
                <Row style={{ marginTop:'10px' }}>
                    <Col className={ styles.right } key={1} span={ 2 } offset={4}>
                        <label className={ styles.label }>文案2：</label>
                    </Col>
                    <Col key={2} span={ 8 }>
                        <Input value={ this.getWord2() } onChange={ this.changeWord2 } placeholder="不超过15个字"/>
                    </Col>
                </Row>
                <Row style={{ marginTop:'10px' }} type="flex" align="top" gutter={ 2 }>
                    <Col className={ styles.right } key={1} span={ 2 } offset={4}>
                    <label className={ styles.label }>示例：</label>
                    </Col>
                    <Col key={2} span={ 8 }>
                        <div className={ styles.picBox }>
                            <div className={ styles.qrcodeBox }>
                                <h2>{ this.getWord1() }</h2>
                                <img src={ titleImg } alt=""/>
                                <h3>{ this.getWord2() }</h3>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row style={{ marginTop:'20px' }} type="flex" align="middle" gutter={ 2 }>
                    <Col key={1} span={ 2 } offset={2}>
                        <Radio checked={ this.getChecked(2) } onChange={ this.radioChange.bind(this,2) }>图片广告</Radio>
                    </Col>
                    <Col className={ styles.right } key={2} span={ 2 }>
                        <label className={ styles.label }>竖屏：</label>
                    </Col>
                    <Col key={3} span={ 16 }>
                    { this.getUpload('上传',2) }
                    </Col>
                </Row>
                <Row style={{ marginTop:'10px' }} type="flex" align="middle" gutter={ 2 }>
                    <Col className={ styles.right } key={1} span={ 2 } offset={4}>
                        <label className={ styles.label }>横屏：</label>
                    </Col>
                    <Col key={2} span={ 16 }>
                    { this.getUpload('上传',3) }
                    </Col>
                </Row>
                <Row style={{ marginTop:'10px' }} type="flex" align="middle" gutter={ 2 }>
                    <Col key={1} span={ 2 } offset={2}>
                        <Radio checked={ this.getChecked(3) } onChange={ this.radioChange.bind(this,3) }>节日主题</Radio>
                    </Col>
                </Row>
                <Row style={{ marginTop:'10px' }} type="flex" align="middle" gutter={ 2 }>
                    <Col key={1} span={ 2 } offset={2}>
                        <Radio checked={ this.getChecked(4) } onChange={ this.radioChange.bind(this,4) }>全都不选</Radio>
                    </Col>
                </Row>
                <Divider />
                <Row style={{ marginTop:'10px' }} type="flex" align="middle" gutter={ 2 }>
                    <Col className={ styles.center } key={1} span={ 8 } offset={6}>
                        <Button type="primary" onClick={ this.handleSubmit }>确定</Button>
                    </Col>
                </Row>
                <Modal
                    title="预览"
                    noFooter={ true }
                    ref={ ref => this.modalPic = ref }
                >
                    <img className={ styles.nowSrc } src={ nowSrc } alt=""/>
                </Modal>
            </div>
        )
    }
}
