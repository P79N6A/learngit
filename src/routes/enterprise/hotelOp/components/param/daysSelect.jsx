import React,{ PureComponent } from 'react'
import { Form, Row, Col, Button, LocaleProvider, Select, InputNumber } from 'antd'
import styles from './daysSelect.less'
import zhCN from 'antd/lib/locale-provider/zh_CN';
const { Option } = Select;
export default class DaysSelect extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            v:'',
            se:''
        }
    }

    componentWillReceiveProps(nextProps) {
        const { editHotel } = nextProps
        const { globalCommonConfig = {} } = editHotel
        if(globalCommonConfig.alipayIncidentalsDDays || globalCommonConfig.alipayIncidentalsDDays === 0) {
            this.setState({
                v:globalCommonConfig.alipayIncidentalsDDays,
                se:'alipayIncidentalsDDays'
            })
        }
        if(globalCommonConfig.alipayIncidentalsCDays || globalCommonConfig.alipayIncidentalsCDays === 0) {
            this.setState({
                v:globalCommonConfig.alipayIncidentalsCDays,
                se:'alipayIncidentalsCDays'
            })
        }
        if(!globalCommonConfig || (!globalCommonConfig.alipayIncidentalsDDays && !globalCommonConfig.alipayIncidentalsCDays)) {
            this.setState({
                v:'',
                se:'alipayIncidentalsDDays'
            })
        }
    }

    handleSubmit_ = (e) => {
        const { update } = this.props;
        e.preventDefault();
        const { se, v } = this.state;
        if(se == 'alipayIncidentalsDDays') {
            update({
                'alipayIncidentalsDDays':(v || v === 0)?v:''
            })
        } else if(se == 'alipayIncidentalsCDays') {
            update({
                'alipayIncidentalsCDays':(v || v === 0)?v:''
            })
        }
    }

    reset = () => {

    }

    selectChange = (key) => {
        const { editHotel } = this.props
        const { globalCommonConfig } = editHotel
        if(globalCommonConfig) {
            this.setState({
                v:globalCommonConfig[key],
            })
        }
        this.setState({
            se:key
        })
    }

    inputNum = (v) => {
        this.setState({ v })
    }

    getDom = () => {
        return (
            <Row type="flex" align='middle' gutter={ 16 }>
                <Col key={1} span={ 4 } offset={2}>
                    <Select onChange={ this.selectChange } value={ this.state.se }>
                        <Option value="alipayIncidentalsDDays">杂费天数(预授权押金)</Option>
                        <Option value="alipayIncidentalsCDays">入住天数(预授权押金)</Option>
                    </Select>
                </Col>
                <Col key={2} span={ 6 }>
                    <InputNumber onChange={ this.inputNum } value={ this.state.v } style={{ width:'100%' }} min={0} max={1000} placeholder="输入天数"/>
                </Col>
                <Col key={3} span={ 12 }>
                    <Button className={ styles.button } type="primary" htmlType="submit">确定</Button>
                </Col>
            </Row>
        )
    }

    render() {
        return (
            <LocaleProvider locale={zhCN}>
                <Form onSubmit={this.handleSubmit_} className={styles.form}>
                    { this.getDom() }
                </Form>   
            </LocaleProvider>
        )
    }
}
