import React,{ PureComponent } from 'react'
import { Form, Row, Col, Button, LocaleProvider, Select } from 'antd'
import styles from './formParallel.less'
import withRef from '@components/HOC/withRef/withRef'
import zhCN from 'antd/lib/locale-provider/zh_CN';
const { Option } = Select
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
export default class FormParallel extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isShow:null
        }
    }
    handleSubmit_ = (e) => {
        const { update } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {//可以提交
                update(values)
            }
        });
    }

    reset = () => {
        const { form } = this.props
        const { resetFields } = form
        resetFields()
        this.setState({
            isShow:null
        })
    }

    parallelCh = (v) => {
        this.setState({
            isShow:v
        })
    }

    getDom = () => {
        const { getFieldDecorator } = this.props.form
        const { colSpan1 = 10, colSpan2 = 12, creditAuthParallelFlag, showAllSceneActivitiesFlag } = this.props
        const flag = this.state.isShow || creditAuthParallelFlag || '0'

        return (
            <div style={{ margin:'20px 0px' }}>
                <Row key={ 1 } type="flex" align={ 'middle' } gutter={ 16 }>
                    <Col key={1} span={ colSpan1 } offset={2}>
                        <FormItem {...formItemLayout} label={ '是否开启信用住和预授权并行页' }>
                            {getFieldDecorator('creditAuthParallelFlag', {
                                rules:[{ required:true }],
                                initialValue:creditAuthParallelFlag || '0'
                            })(
                                <Select onChange={ this.parallelCh }>
                                    <Option value="1">是</Option>
                                    <Option value="0">否</Option>
                                </Select>
                            )}
                        </FormItem> 
                    </Col>
                    <Col key={2} span={ colSpan2 }>
                        <Button className={ styles.button } type="primary" htmlType="submit">确定</Button>
                    </Col>
                </Row>
                {
                    flag == '1' && (
                        <Row key={ 2 } type="flex" align={ 'middle' } gutter={ 16 }>
                            <Col key={1} span={ colSpan1 } offset={2}>
                                <FormItem {...formItemLayout} label={ '是否展示全场景活动' }>
                                    {getFieldDecorator('showAllSceneActivitiesFlag', {
                                        rules:[{ required:true }],
                                        initialValue:showAllSceneActivitiesFlag || '0'
                                    })(
                                        <Select>
                                            <Option value="1">是</Option>
                                            <Option value="0">否</Option>
                                        </Select>
                                    )}
                                </FormItem> 
                            </Col>
                            <Col key={2} span={ colSpan2 }>
                                <Button className={ styles.button } type="primary" htmlType="submit">确定</Button>
                            </Col>
                        </Row>
                    )
                }
                
            </div>
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
