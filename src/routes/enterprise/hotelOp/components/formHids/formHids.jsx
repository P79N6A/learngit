import React, { PureComponent } from 'react'
import { Form, Row, Col, Button, Input, Icon, LocaleProvider } from 'antd'
import styles from './formHids.less'
import { _jsonParse } from '@utils/tools'
import withRef from '@components/HOC/withRef/withRef'
import zhCN from 'antd/lib/locale-provider/zh_CN';
const FormItem = Form.Item;
const formItemLayoutLine = {
    labelCol: { span: 10 },
    wrapperCol: { span: 24 },
  };
//存放添加行点击删除后的roomType数组
let temLines = [];
let isTemLines = true
let uuid = 0;

@Form.create()
@withRef
export default class FormHids extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isShow: null,
        }
    }

    componentDidMount() {
        temLines = [];
        isTemLines = true
    }

    reset = () => {
        isTemLines = true
        const { form } = this.props
        const { resetFields } = form
        resetFields()
    }

    contains = (arrays, obj) => {
        var i = arrays.length;
        while (i--) {
            if (arrays[i] === obj) {
                return i;
            }
        }
        return false;
    }

    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        //同时删除临时数组,防止删除第一条默认列表后初始化又增加了这一条记录
        const indexLoca = this.contains(keys, k)
        temLines.splice(indexLoca, 1)
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }

    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        uuid++;
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

    getAddItem = (obj) => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const initialValue = obj.map((v, n) => {
            return n
        })
        getFieldDecorator('keys', { initialValue });
        const keys = getFieldValue('keys');
        uuid = keys.length > 0 ? keys[keys.length - 1] + 1 : 0
        return keys.map((k, index) => {
            return (
                <FormItem
                    {...formItemLayoutLine}
                    label={null}
                    key={k}
                    className={styles.addLine}
                >
                    <Row gutter={16} className={styles.addRow}>
                        <Col span={9}>
                            <FormItem>
                                {getFieldDecorator(`addLine_fliggyNonUltimateHids_fgHid[${k}]`, {
                                    rules: [{ required: false, message: 'fgHid' }],
                                    initialValue: obj[index] ? obj[index].fgHid : ''
                                })(
                                    <Input placeholder='fgHid' />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={9}>
                            <FormItem >
                                {getFieldDecorator(`addLine_fliggyNonUltimateHids_fgSellerId[${k}]`, {
                                    rules: [{ required: false, message: 'fgSellerId' }],
                                    initialValue: obj[index] ? obj[index].fgSellerId : ''
                                })(
                                    <Input placeholder='fgSellerId' />
                                )}
                            </FormItem>
                        </Col>
                        {keys.length > 0 ? (
                            <Col span={6}>
                                <Button
                                    className={styles.deleteBtn}
                                    type="primary"
                                    size="small"
                                    onClick={() => this.remove(k)}
                                >删除</Button>
                            </Col>
                        ) : null}
                    </Row>
                </FormItem>
            );
        });
    }

    render() {
        const { data } = this.props
        //为添加行的参数 临时数组第一次赋值，通过isTemLines避免删除重新render导致数据清除不掉
        if(isTemLines) {
            temLines = (data && _jsonParse(data)) || [{ fgHid: "", fgSellerId: ""}];
            isTemLines = false
        }
        return (
            <LocaleProvider locale={zhCN}>
                <Form className={styles.form}>
                    {this.getAddItem(temLines)}
                    <Row type="flex" justify="center" style={{ marginTop: '10px' }}>
                        <Col span={6}>
                            <Button style={{ display: 'inline-block' }} type="default" onClick={this.add}>
                                <Icon type="plus" /> 新增
                        </Button>
                        </Col>
                    </Row>
                </Form>
            </LocaleProvider>
        )
    }
}
