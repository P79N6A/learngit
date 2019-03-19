import React,{ Component } from 'react'
import { Input, InputNumber, Select, Button, message, Row, Col } from 'antd'
import styles from './param.less'
import ConfigForm from '@components/configForm/configForm'
import MakeCardForm from './param/makeCard'
import FormHids from './formHids/formHids'
import FormParallel from './formParallel/formParallel'
import DaysSelect from './param/daysSelect'
import { pickBy } from 'lodash'
import { isNumber, max } from '@utils/valid'
import { Editor } from 'react-draft-wysiwyg';
import Modal from '@components/modal/modal'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
const Option = Select.Option;

const housePriceParam = { 
    name:'房价', 
    key:'roomPrice', 
    rules:msg => [{ required:true, message:msg },{ validator:isNumber(20) }],
    item:(name) => {
        return (
            <Input placeholder={name}/>
        )
    } 
}
const incidentalsParam = { 
    name:'房杂费', 
    key:'incidentals', 
    rules:msg => [{ required:true, message:msg },{ validator:isNumber(20) }],
    item:(name) => {
        return (
            <Input placeholder={name}/>
        )
    } 
}

const waitTimeParam = { 
    name:'预约入住等待时间', 
    key:'orderWaitTime', 
    rules:msg => [{ required:true, message:msg },{ validator:isNumber(20) }],
    item:(name) => {
        return (
            <Input placeholder={name}/>
        )
    } 
}
const routingRateParam = { 
    name:'分账比例（%）', 
    key:'royaltyRate', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <InputNumber className={ styles.inputNumber } min={1} max={100} placeholder={name}/>
        )
    } 
}
const imgUrlParam = { 
    name:'自助机背景图片', 
    key:'imageUrl', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <Input placeholder={name}/>
        )
    } 
}
const prepayParam = { 
    name:'预授权付款码', 
    key:'prepayCode', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <Input placeholder={name}/>
        )
    } 
}
const alipayParam = { 
    name:'信用住付款码', 
    key:'alipayCode', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <Input placeholder={name}/>
        )
    } 
}
const showRoomParam = { 
    name:'是否显示房费', 
    key:'showRoomCost', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <Select>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
            </Select>
        )
    } 
}
const openInputMPParam = { 
    name:'是否开启手机输入', 
    key:'openInputPhone', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <Select>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
            </Select>
        )
    } 
}
const openUnCreditParam = { 
    name:'是否开启信用住资格校验', 
    key:'checkQualifications', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <Select>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
            </Select>
        )
    } 
}
const testHotelFlagParam = { 
    name:'是否是测试酒店', 
    key:'testHotelFlag', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <Select>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
            </Select>
        )
    } 
}
const openCreditSignParam = { 
    name:'是否开启信用住签约', 
    key:'openCreditSign', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <Select>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
            </Select>
        )
    } 
}
const openPreAuthParam = { 
    name:'是否开启预授权', 
    key:'openPreAuth', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <Select>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
            </Select>
        )
    } 
}
const openPreCheckInParam = { 
    name:'是否开启预约入住', 
    key:'openPreCheckIn', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <Select>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
            </Select>
        )
    } 
}
const openPreMakeCardParam = { 
    name:'是否开启预约制卡', 
    key:'openPreMakeCard', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <Select>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
            </Select>
        )
    } 
}
const openChooseRoomOnlineParam = { 
    name:'是否开启在线选房', 
    key:'openChooseRoomOnline', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <Select>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
            </Select>
        )
    } 
}
const showHotelFloorParam = { 
    name:'是否显示楼层楼号', 
    key:'showHotelFloor', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <Select>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
            </Select>
        )
    } 
}
const showFaceScanPreAuthFlag = { 
    name:'是否开启刷脸预授权', 
    key:'faceScanPreAuthFlag', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <Select>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
            </Select>
        )
    } 
}
const reservationQueryFlag = { 
    name:'是否开启预定号查询', 
    key:'reservationQueryFlag', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <Select>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
            </Select>
        )
    } 
}
const uygurMessageFlag = { 
    name:'维吾尔族客人入住通知', 
    key:'uygurMessageFlag', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <Select>
                <Option value="1">开启</Option>
                <Option value="0">关闭</Option>
            </Select>
        )
    } 
}
const maxCheckinGuestParam = { 
    name:'最大入住人数', 
    key:'maxCheckinGuest', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <InputNumber className={ styles.inputNumber } min={1} max={10} placeholder={name}/>
        )
    } 
}
const hintMessageParam = { 
    name:'提示信息', 
    key:'hintMessage', 
    rules:msg => [{ required:false, message:msg }],
    item:(name) => {
        return (
            <Input placeholder={name}/>
        )
    } 
}
const breakfastCodeParam = { 
    name:'早餐code', 
    key:'breakfastCode', 
    rules:msg => [{ required:false, message:msg }, { validator:max(60) }],
    item:(name) => {
        return (
            <Input placeholder={name}/>
        )
    } 
}
const alipayMaxParam = { 
    name:'杂费上限（预授权押金）', 
    key:'alipayIncidentalsMax', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <InputNumber className={ styles.inputNumber } min={0} max={1000000} placeholder={name}/>
        )
    } 
}
const hotelHintParam = rawState => {
    return {
        name:'酒店入住政策', 
        key:'hotelHint', 
        rules:msg => [],
        item:() => {
            return (
                <Editor
                    initialContentState={ rawState }
                    localization={{ locale: 'zh' }}
                    wrapperClassName={ styles.wrapper }
                    editorClassName={ styles.editor }
                    toolbar={{
                        options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'history']
                    }}
                />
            )
        } 
    }
}
export default class Param extends Component {
    //合并为对象数组
    getTrueParams = (v) => {
        console.log('------',v)
        for(let key in v) {
            /**
             * 该判断主要将添加行的行数据组合成真正的参数，因为存在删除这一样，导致数组中会存在empty的情况所以下标重新定义
             */
            if(key.includes('addLine')) {
                let addLineArr = key.split('_');
                v[addLineArr[1]] = v[addLineArr[1]]?v[addLineArr[1]]:[];
                let addLineTrueV = v[addLineArr[1]];
                //过滤empty 获取下标书组
                let indexInit = 0;
                v[key].map((vAdd) => {
                    if(!addLineTrueV[indexInit]) {
                        addLineTrueV[indexInit] = {};
                    }
                    addLineTrueV[indexInit][addLineArr[2]] = vAdd;
                    indexInit++;
                })
            }
        }
    }

    showHids = () => {
        const reset = this.showHidsRef && this.showHidsRef.reset;
        this.modalHids && this.modalHids.changeVisible(true)
        reset && reset()
    }

    handleOkHids = () => {
        const { setProperties } = this.props
        const { form } = this.showHidsRef.props;
        const { validateFields } = form;
        const reset = this.showHidsRef && this.showHidsRef.reset;
        validateFields((err, values) => {
            if (!err) {//可以提交
                this.getTrueParams(values)
                const noNullArr = []
                values.fliggyNonUltimateHids && values.fliggyNonUltimateHids.map(v=>{
                    if(v.fgHid && v.fgSellerId) {
                        noNullArr.push({fgHid:v.fgHid,fgSellerId:v.fgSellerId})
                    }
                })
                values.fliggyNonUltimateHids = JSON.stringify(noNullArr)
                values = pickBy(values,(v,key) => {
                    if(['fliggyNonUltimateHids'].includes(key)) return true;
                })
                setProperties(values)
                this.modalHids && this.modalHids.changeVisible(false)
                reset && reset()
            }
        });
    }

    reset = () => {
        this.housePriceRef && this.housePriceRef.reset()
        this.incidentalsRef && this.incidentalsRef.reset()
        this.waitTimeRef && this.waitTimeRef.reset()
        this.routingRateRef && this.routingRateRef.reset()
        this.imgUrlRef && this.imgUrlRef.reset()
        this.hotelHintRef && this.hotelHintRef.reset()
        this.prepayRef && this.prepayRef.reset()
        this.alipayRef && this.alipayRef.reset()
        this.showRoomRef && this.showRoomRef.reset()
        this.showMemberRef && this.showMemberRef.reset()
        this.hintMessageRef && this.hintMessageRef.reset()
        this.breakfastCodeRef && this.breakfastCodeRef.reset()
        this.openInputMPRef && this.openInputMPRef.reset()
        this.openUnCreditRef && this.openUnCreditRef.reset()
        this.testHotelFlagRef && this.testHotelFlagRef.reset()
        this.openCreditSignRef && this.openCreditSignRef.reset()
        this.openPreAuthRef && this.openPreAuthRef.reset()
        this.openPreCheckInRef && this.openPreCheckInRef.reset()
        this.openPreMakeCardRef && this.openPreMakeCardRef.reset()
        this.openChooseRoomOnlineRef && this.openChooseRoomOnlineRef.reset()
        this.showHotelFloorRef && this.showHotelFloorRef.reset()
        this.showFaceScanRef && this.showFaceScanRef.reset()
        this.uygurMessageFlagRef && this.uygurMessageFlagRef.reset()
        this.reservationQueryFlagRef && this.reservationQueryFlagRef.reset()
        this.showParallelRef && this.showParallelRef.reset()
        this.makeCardRef && this.makeCardRef.reset()
        this.maxCheckinGuestRef && this.maxCheckinGuestRef.reset()
        this.hidsRef && this.hidsRef.reset()
    }
    getInitialValue = (key) => {
        const { editHotel } = this.props
        const { globalCommonConfig } = editHotel
        return (globalCommonConfig && globalCommonConfig[key]) || ''
    }

    checkHotelHint = (values) => {
        const { setProperties } = this.props
        values.hotelHint = draftToHtml(values.hotelHint)
        if(values.hotelHint.length >19999) {
            message.error('入住政策不得多于2万字')
            return
        }
        setProperties(values)
    }

    render() {
        const { setProperties, editHotel, save } = this.props
        const { globalCommonConfig } = editHotel
        let hotelHint = (globalCommonConfig && globalCommonConfig['hotelHint']) || '';
        let rawState = '';
        const blocksFromHtml = convertFromHTML(hotelHint || '<p></p>');
        const { contentBlocks, entityMap } = blocksFromHtml;
        if(contentBlocks) {
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            rawState = convertToRaw(contentState);
        }
        return (
            globalCommonConfig ? <div>
                <ConfigForm 
                    initialValue={ this.getInitialValue(housePriceParam.key) }
                    params = { housePriceParam }
                    getInstance={ ref => this.housePriceRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(incidentalsParam.key) }
                    params = { incidentalsParam }
                    getInstance={ ref => this.incidentalsRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(waitTimeParam.key) }
                    params = { waitTimeParam }
                    getInstance={ ref => this.waitTimeRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(routingRateParam.key) }
                    params = { routingRateParam }
                    getInstance={ ref => this.routingRateRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(imgUrlParam.key) }
                    params = { imgUrlParam }
                    getInstance={ ref => this.imgUrlRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(prepayParam.key) }
                    params = { prepayParam }
                    getInstance={ ref => this.prepayRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(alipayParam.key) }
                    params = { alipayParam }
                    getInstance={ ref => this.alipayRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(showRoomParam.key) || '1' }
                    params = { showRoomParam }
                    getInstance={ ref => this.showRoomRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(hintMessageParam.key) }
                    params = { hintMessageParam }
                    getInstance={ ref => this.hintMessageRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(breakfastCodeParam.key) }
                    params = { breakfastCodeParam }
                    getInstance={ ref => this.breakfastCodeRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(openInputMPParam.key) || '1' }
                    params = { openInputMPParam }
                    getInstance={ ref => this.openInputMPRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(openUnCreditParam.key) || '1' }
                    params = { openUnCreditParam }
                    getInstance={ ref => this.openUnCreditRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(testHotelFlagParam.key) || '0' }
                    params = { testHotelFlagParam }
                    getInstance={ ref => this.testHotelFlagRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(openCreditSignParam.key) || '0' }
                    params = { openCreditSignParam }
                    getInstance={ ref => this.openCreditSignRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(openPreAuthParam.key) || '0' }
                    params = { openPreAuthParam }
                    getInstance={ ref => this.openPreAuthRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(openPreCheckInParam.key) || '0' }
                    params = { openPreCheckInParam }
                    getInstance={ ref => this.openPreCheckInRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(openPreMakeCardParam.key) || '0' }
                    params = { openPreMakeCardParam }
                    getInstance={ ref => this.openPreMakeCardRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(openChooseRoomOnlineParam.key) || '0' }
                    params = { openChooseRoomOnlineParam }
                    getInstance={ ref => this.openChooseRoomOnlineRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(showHotelFloorParam.key) || '0' }
                    params = { showHotelFloorParam }
                    getInstance={ ref => this.showHotelFloorRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(showFaceScanPreAuthFlag.key) || '0' }
                    params = { showFaceScanPreAuthFlag }
                    getInstance={ ref => this.showFaceScanRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(reservationQueryFlag.key) || '0' }
                    params = { reservationQueryFlag }
                    getInstance={ ref => this.reservationQueryFlagRef = ref } 
                    update={ setProperties }
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(uygurMessageFlag.key) || '0' }
                    params = { uygurMessageFlag }
                    getInstance={ ref => this.uygurMessageFlagRef = ref } 
                    update={ setProperties }
                />
                <FormParallel 
                    getInstance={ ref => this.showParallelRef = ref } 
                    update={ setProperties }
                    creditAuthParallelFlag={ this.getInitialValue('creditAuthParallelFlag') }
                    showAllSceneActivitiesFlag={ this.getInitialValue('showAllSceneActivitiesFlag') }
                />
                <Row style={{ marginBottom:'10px' }}>
                    <Col span={ 4 } offset={2} style={{ textAlign:'right', color:'rgba(0, 0, 0, 0.85)' }}>
                        飞猪非旗舰酒店id配置：
                    </Col>
                    <Col span={ 12 } style={{ marginLeft:'6px' }}>
                        <Button size="small" onClick={ this.showHids }>开始配置</Button>
                    </Col>
                </Row>
                <Modal
                    title="配置"
                    ref={ref => this.modalHids = ref}
                    notOkHidden = { true }
                    onOk={ this.handleOkHids }
                    >
                    <FormHids 
                        getInstance={ ref => this.showHidsRef = ref } 
                        data={ this.getInitialValue('fliggyNonUltimateHids') }
                    />
                </Modal>
                <ConfigForm 
                    initialValue={ this.getInitialValue(maxCheckinGuestParam.key) || 3 }
                    params = { maxCheckinGuestParam }
                    getInstance={ ref => this.maxCheckinGuestRef = ref } 
                    update={ setProperties }
                />
                <MakeCardForm 
                    initialValue={ this.getInitialValue('makeCardsNumber') } 
                    update={ setProperties } 
                    save={ save } 
                    editHotel={ editHotel } 
                    getInstance={ ref => this.makeCardRef = ref } 
                />
                <ConfigForm 
                    initialValue={ this.getInitialValue(alipayMaxParam.key) } 
                    params = { alipayMaxParam }
                    getInstance={ ref => this.alipayMaxRef = ref } 
                    update={ setProperties } 
                />
                <DaysSelect 
                    update={ setProperties } 
                    save={ save } 
                    editHotel={ editHotel } 
                    ref={ ref => this.makeCardRef = ref } 
                />
                {(rawState && hotelHint) ? <ConfigForm 
                    initialValue={ rawState }
                    params = { hotelHintParam(rawState) }
                    getInstance={ ref => this.hotelHintRef = ref } 
                    update={ this.checkHotelHint }
                    align='top'
                />:<ConfigForm 
                    initialValue={ EditorState.createEmpty() }
                    params = { hotelHintParam('') }
                    getInstance={ ref => this.hotelHintRef = ref } 
                    update={ this.checkHotelHint }
                    align='top'
                />}
            </div>:null
        )
    }
}
