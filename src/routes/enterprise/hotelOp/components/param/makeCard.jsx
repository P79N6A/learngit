import React,{ Component } from 'react'
import { Form, Row, Col, Button, LocaleProvider, Radio, InputNumber } from 'antd'
import styles from './makeCard.less'
import withRef from '@components/HOC/withRef/withRef'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { max } from '@utils/valid'
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 10 },
        sm: { span: 10 },
    },
    wrapperCol: {
        xs: { span: 20 },
        sm: { span: 14 },
    },
};

@Form.create()
@withRef
export default class MakeCardForm extends Component {
    state = {
        value: 0,
    }
    handleSubmit_ = (e) => {
        const { update } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {//可以提交
                if(values.makeCardsNumber == 1) {
                    values.makeCardsNumber = this.state.value
                }
                update(values)
            }
        });
    }

    makeCardChange = (e) => {
        const { save } = this.props
        const tab = e.target.value;
        if(tab == 1) {
            save({ makeCardTab:1 })
        } else if(tab == 0) {
            save({ makeCardTab:0 })
        }
    }

    changeNum = (num) => {
        this.setState({
            value:num
        })
    }

    reset = () => {
        const { form, initialValue, save } = this.props
        const { resetFields } = form
        resetFields()
        save({ makeCardTab:null })
        if(initialValue) {
            this.setState({
                value:initialValue
            })
        } else {
            this.setState({
                value:0
            })
        }
    }

    getDisabled = () => {
        //优先根据当前页makeCard标识判断是否可用，第一次进来根据初始值判断
        const { editHotel, initialValue } = this.props
        const { makeCardTab } = editHotel
        if(makeCardTab || (initialValue && initialValue != 0 && makeCardTab!=0)) {
            return false
        } else {
            return true
        }
    }

    getDom = () => {
        const { getFieldDecorator } = this.props.form
        const { editHotel, initialValue } = this.props
        const { makeCardTab } = editHotel
        return (
            <Row type="flex" align='middle' gutter={ 16 }>
                <Col key={1} span={ 10 } offset={2}>
                    <FormItem {...formItemLayout} label='制卡数'>
                        {getFieldDecorator('makeCardsNumber', {
                            rules:[{ required:true }, { validator:max(30) }],
                            initialValue:(initialValue && initialValue != 0)?1:0
                        })(
                            <RadioGroup onChange={ this.makeCardChange }>
                                <Radio value={1}>
                                <div className={ styles.makeCardBox }>
                                    <span>指定：</span>
                                    <InputNumber onChange={ this.changeNum } disabled={ this.getDisabled() } min={1} max={10} value={ this.state.value || initialValue }/>
                                    <span> 张</span>
                                </div>
                                </Radio>
                                <Radio value={0}>一人一卡</Radio>
                            </RadioGroup>
                        )}
                    </FormItem> 
                </Col>
                <Col key={2} span={ 12 }>
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
